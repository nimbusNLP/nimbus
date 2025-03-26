"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.Manifest = exports.VERSION_MISMATCH = void 0;
const JSII_RTTI_SYMBOL_1 = Symbol.for("jsii.rtti");
const fs = require("fs");
const jsonschema = require("jsonschema");
const semver = require("semver");
const assembly = require("./cloud-assembly");
/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable @typescript-eslint/no-require-imports */
// this prefix is used by the CLI to identify this specific error.
// in which case we want to instruct the user to upgrade his CLI.
// see exec.ts#createAssembly
exports.VERSION_MISMATCH = 'Cloud assembly schema version mismatch';
const ASSETS_SCHEMA = require("../schema/assets.schema.json");
const ASSEMBLY_SCHEMA = require("../schema/cloud-assembly.schema.json");
const INTEG_SCHEMA = require("../schema/integ.schema.json");
/**
 * Version is shared for both manifests
 */
const SCHEMA_VERSION = require("../schema/version.json");
/**
 * Protocol utility class.
 */
class Manifest {
    /**
     * Validates and saves the cloud assembly manifest to file.
     *
     * @param manifest - manifest.
     * @param filePath - output file path.
     */
    static saveAssemblyManifest(manifest, filePath) {
        Manifest.saveManifest(manifest, filePath, ASSEMBLY_SCHEMA, Manifest.patchStackTagsOnWrite);
    }
    /**
     * Load and validates the cloud assembly manifest from file.
     *
     * @param filePath - path to the manifest file.
     */
    static loadAssemblyManifest(filePath, options) {
        return Manifest.loadManifest(filePath, ASSEMBLY_SCHEMA, Manifest.patchStackTagsOnRead, options);
    }
    /**
     * Validates and saves the asset manifest to file.
     *
     * @param manifest - manifest.
     * @param filePath - output file path.
     */
    static saveAssetManifest(manifest, filePath) {
        Manifest.saveManifest(manifest, filePath, ASSETS_SCHEMA, Manifest.patchStackTagsOnRead);
    }
    /**
     * Load and validates the asset manifest from file.
     *
     * @param filePath - path to the manifest file.
     */
    static loadAssetManifest(filePath) {
        return this.loadManifest(filePath, ASSETS_SCHEMA);
    }
    /**
     * Validates and saves the integ manifest to file.
     *
     * @param manifest - manifest.
     * @param filePath - output file path.
     */
    static saveIntegManifest(manifest, filePath) {
        Manifest.saveManifest(manifest, filePath, INTEG_SCHEMA);
    }
    /**
     * Load and validates the integ manifest from file.
     *
     * @param filePath - path to the manifest file.
     */
    static loadIntegManifest(filePath) {
        const manifest = this.loadManifest(filePath, INTEG_SCHEMA);
        // Adding typing to `validate()` led to `loadManifest()` to properly infer
        // its return type, which indicated that the return type of this
        // function may be a lie. I could change the schema to make `testCases`
        // optional, but that will bump the major version of this package and I
        // don't want to do that. So instead, just make sure `testCases` is always there.
        return {
            ...manifest,
            testCases: manifest.testCases ?? [],
        };
    }
    /**
     * Fetch the current schema version number.
     */
    static version() {
        return `${SCHEMA_VERSION.revision}.0.0`;
    }
    /**
     * Deprecated
     * @deprecated use `saveAssemblyManifest()`
     */
    static save(manifest, filePath) {
        return this.saveAssemblyManifest(manifest, filePath);
    }
    /**
     * Deprecated
     * @deprecated use `loadAssemblyManifest()`
     */
    static load(filePath) {
        return this.loadAssemblyManifest(filePath);
    }
    static validate(manifest, schema, options) {
        function parseVersion(version) {
            const ver = semver.valid(version);
            if (!ver) {
                throw new Error(`Invalid semver string: "${version}"`);
            }
            return ver;
        }
        const maxSupported = semver.major(parseVersion(Manifest.version()));
        const actual = parseVersion(manifest.version);
        // first validate the version should be accepted. all versions within the same minor version are fine
        if (maxSupported < semver.major(actual) && !options?.skipVersionCheck) {
            // If we have a more specific error to throw than the generic one below, make sure to add that info.
            const cliVersion = manifest.minimumCliVersion;
            let cliWarning = '';
            if (cliVersion) {
                cliWarning = `. You need at least CLI version ${cliVersion} to read this manifest.`;
            }
            // we use a well known error prefix so that the CLI can identify this specific error
            // and print some more context to the user.
            throw new Error(`${exports.VERSION_MISMATCH}: Maximum schema version supported is ${maxSupported}.x.x, but found ${actual}${cliWarning}`);
        }
        // now validate the format is good.
        const validator = new jsonschema.Validator();
        const result = validator.validate(manifest, schema, {
            // does exist but is not in the TypeScript definitions
            nestedErrors: true,
            allowUnknownAttributes: false,
            preValidateProperty: Manifest.validateAssumeRoleAdditionalOptions,
        });
        let errors = result.errors;
        if (options?.skipEnumCheck) {
            // Enum validations aren't useful when
            errors = stripEnumErrors(errors);
        }
        if (errors.length > 0) {
            throw new Error(`Invalid assembly manifest:\n${errors.map((e) => e.stack).join('\n')}`);
        }
    }
    static saveManifest(manifest, filePath, schema, preprocess) {
        let withVersion = { ...manifest, version: Manifest.version() };
        Manifest.validate(withVersion, schema);
        if (preprocess) {
            withVersion = preprocess(withVersion);
        }
        fs.writeFileSync(filePath, JSON.stringify(withVersion, undefined, 2));
    }
    static loadManifest(filePath, schema, preprocess, options) {
        const contents = fs.readFileSync(filePath, { encoding: 'utf-8' });
        let obj;
        try {
            obj = JSON.parse(contents);
        }
        catch (e) {
            throw new Error(`${e.message}, while parsing ${JSON.stringify(contents)}`);
        }
        if (preprocess) {
            obj = preprocess(obj);
        }
        Manifest.validate(obj, schema, options);
        return obj;
    }
    /**
     * This requires some explaining...
     *
     * We previously used `{ Key, Value }` for the object that represents a stack tag. (Notice the casing)
     * @link https://github.com/aws/aws-cdk/blob/v1.27.0/packages/aws-cdk/lib/api/cxapp/stacks.ts#L427.
     *
     * When that object moved to this package, it had to be JSII compliant, which meant the property
     * names must be `camelCased`, and not `PascalCased`. This meant it no longer matches the structure in the `manifest.json` file.
     * In order to support current manifest files, we have to translate the `PascalCased` representation to the new `camelCased` one.
     *
     * Note that the serialization itself still writes `PascalCased` because it relates to how CloudFormation expects it.
     *
     * Ideally, we would start writing the `camelCased` and translate to how CloudFormation expects it when needed. But this requires nasty
     * backwards-compatibility code and it just doesn't seem to be worth the effort.
     */
    static patchStackTagsOnRead(manifest) {
        return Manifest.replaceStackTags(manifest, (tags) => tags.map((diskTag) => ({
            key: diskTag.Key,
            value: diskTag.Value,
        })));
    }
    /**
     * Validates that `assumeRoleAdditionalOptions` doesn't contain nor `ExternalId` neither `RoleArn`, as they
     * should have dedicated properties preceding this (e.g `assumeRoleArn` and `assumeRoleExternalId`).
     */
    static validateAssumeRoleAdditionalOptions(instance, key, _schema, _options, _ctx) {
        if (key !== 'assumeRoleAdditionalOptions') {
            // note that this means that if we happen to have a property named like this, but that
            // does want to allow 'RoleArn' or 'ExternalId', this code will have to change to consider the full schema path.
            // I decided to make this less granular for now on purpose because it fits our needs and avoids having messy
            // validation logic due to various schema paths.
            return;
        }
        const assumeRoleOptions = instance[key];
        if (assumeRoleOptions?.RoleArn) {
            throw new Error(`RoleArn is not allowed inside '${key}'`);
        }
        if (assumeRoleOptions?.ExternalId) {
            throw new Error(`ExternalId is not allowed inside '${key}'`);
        }
    }
    /**
     * See explanation on `patchStackTagsOnRead`
     *
     * Translate stack tags metadata if it has the "right" casing.
     */
    static patchStackTagsOnWrite(manifest) {
        return Manifest.replaceStackTags(manifest, (tags) => tags.map((memTag) => 
        // Might already be uppercased (because stack synthesis generates it in final form yet)
        ('Key' in memTag ? memTag : { Key: memTag.key, Value: memTag.value })));
    }
    /**
     * Recursively replace stack tags in the stack metadata
     */
    static replaceStackTags(manifest, fn) {
        // Need to add in the `noUndefined`s because otherwise jest snapshot tests are going to freak out
        // about the keys with values that are `undefined` (even though they would never be JSON.stringified)
        return noUndefined({
            ...manifest,
            artifacts: mapValues(manifest.artifacts, (artifact) => {
                if (artifact.type !== assembly.ArtifactType.AWS_CLOUDFORMATION_STACK) {
                    return artifact;
                }
                return noUndefined({
                    ...artifact,
                    metadata: mapValues(artifact.metadata, (metadataEntries) => metadataEntries.map((metadataEntry) => {
                        if (metadataEntry.type !== assembly.ArtifactMetadataEntryType.STACK_TAGS ||
                            !metadataEntry.data) {
                            return metadataEntry;
                        }
                        return {
                            ...metadataEntry,
                            data: fn(metadataEntry.data),
                        };
                    })),
                });
            }),
        });
    }
    constructor() { }
}
exports.Manifest = Manifest;
_a = JSII_RTTI_SYMBOL_1;
Manifest[_a] = { fqn: "@aws-cdk/cloud-assembly-schema.Manifest", version: "39.2.20" };
function mapValues(xs, fn) {
    if (!xs) {
        return undefined;
    }
    const ret = {};
    for (const [k, v] of Object.entries(xs)) {
        ret[k] = fn(v);
    }
    return ret;
}
function noUndefined(xs) {
    const ret = {};
    for (const [k, v] of Object.entries(xs)) {
        if (v !== undefined) {
            ret[k] = v;
        }
    }
    return ret;
}
function stripEnumErrors(errors) {
    return errors.filter((e) => typeof e.schema === 'string' || !('enum' in e.schema));
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFuaWZlc3QuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJtYW5pZmVzdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7OztBQUFBLHlCQUF5QjtBQUN6Qix5Q0FBeUM7QUFDekMsaUNBQWlDO0FBRWpDLDZDQUE2QztBQUc3Qyx1REFBdUQ7QUFDdkQsMERBQTBEO0FBRTFELGtFQUFrRTtBQUNsRSxpRUFBaUU7QUFDakUsNkJBQTZCO0FBQ2hCLFFBQUEsZ0JBQWdCLEdBQVcsd0NBQXdDLENBQUM7QUFFakYsOERBQStEO0FBRS9ELHdFQUF5RTtBQUV6RSw0REFBNkQ7QUFFN0Q7O0dBRUc7QUFDSCx5REFBMEQ7QUFzQzFEOztHQUVHO0FBQ0gsTUFBYSxRQUFRO0lBQ25COzs7OztPQUtHO0lBQ0ksTUFBTSxDQUFDLG9CQUFvQixDQUFDLFFBQW1DLEVBQUUsUUFBZ0I7UUFDdEYsUUFBUSxDQUFDLFlBQVksQ0FBQyxRQUFRLEVBQUUsUUFBUSxFQUFFLGVBQWUsRUFBRSxRQUFRLENBQUMscUJBQXFCLENBQUMsQ0FBQztJQUM3RixDQUFDO0lBRUQ7Ozs7T0FJRztJQUNJLE1BQU0sQ0FBQyxvQkFBb0IsQ0FDaEMsUUFBZ0IsRUFDaEIsT0FBNkI7UUFFN0IsT0FBTyxRQUFRLENBQUMsWUFBWSxDQUFDLFFBQVEsRUFBRSxlQUFlLEVBQUUsUUFBUSxDQUFDLG9CQUFvQixFQUFFLE9BQU8sQ0FBQyxDQUFDO0lBQ2xHLENBQUM7SUFFRDs7Ozs7T0FLRztJQUNJLE1BQU0sQ0FBQyxpQkFBaUIsQ0FBQyxRQUE4QixFQUFFLFFBQWdCO1FBQzlFLFFBQVEsQ0FBQyxZQUFZLENBQUMsUUFBUSxFQUFFLFFBQVEsRUFBRSxhQUFhLEVBQUUsUUFBUSxDQUFDLG9CQUFvQixDQUFDLENBQUM7SUFDMUYsQ0FBQztJQUVEOzs7O09BSUc7SUFDSSxNQUFNLENBQUMsaUJBQWlCLENBQUMsUUFBZ0I7UUFDOUMsT0FBTyxJQUFJLENBQUMsWUFBWSxDQUFDLFFBQVEsRUFBRSxhQUFh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Q0FBQztJQUNELE9BQU8sR0FBRyxDQUFDO0FBQ2IsQ0FBQztBQUVELFNBQVMsZUFBZSxDQUFDLE1BQW9DO0lBQzNELE9BQU8sTUFBTSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsT0FBTyxDQUFDLENBQUMsTUFBTSxLQUFLLFFBQVEsSUFBSSxDQUFDLENBQUMsTUFBTSxJQUFJLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDO0FBQ3JGLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgKiBhcyBmcyBmcm9tICdmcyc7XG5pbXBvcnQgKiBhcyBqc29uc2NoZW1hIGZyb20gJ2pzb25zY2hlbWEnO1xuaW1wb3J0ICogYXMgc2VtdmVyIGZyb20gJ3NlbXZlcic7XG5pbXBvcnQgKiBhcyBhc3NldHMgZnJvbSAnLi9hc3NldHMnO1xuaW1wb3J0ICogYXMgYXNzZW1ibHkgZnJvbSAnLi9jbG91ZC1hc3NlbWJseSc7XG5pbXBvcnQgKiBhcyBpbnRlZyBmcm9tICcuL2ludGVnLXRlc3RzJztcblxuLyogZXNsaW50LWRpc2FibGUgQHR5cGVzY3JpcHQtZXNsaW50L25vLXZhci1yZXF1aXJlcyAqL1xuLyogZXNsaW50LWRpc2FibGUgQHR5cGVzY3JpcHQtZXNsaW50L25vLXJlcXVpcmUtaW1wb3J0cyAqL1xuXG4vLyB0aGlzIHByZWZpeCBpcyB1c2VkIGJ5IHRoZSBDTEkgdG8gaWRlbnRpZnkgdGhpcyBzcGVjaWZpYyBlcnJvci5cbi8vIGluIHdoaWNoIGNhc2Ugd2Ugd2FudCB0byBpbnN0cnVjdCB0aGUgdXNlciB0byB1cGdyYWRlIGhpcyBDTEkuXG4vLyBzZWUgZXhlYy50cyNjcmVhdGVBc3NlbWJseVxuZXhwb3J0IGNvbnN0IFZFUlNJT05fTUlTTUFUQ0g6IHN0cmluZyA9ICdDbG91ZCBhc3NlbWJseSBzY2hlbWEgdmVyc2lvbiBtaXNtYXRjaCc7XG5cbmltcG9ydCBBU1NFVFNfU0NIRU1BID0gcmVxdWlyZSgnLi4vc2NoZW1hL2Fzc2V0cy5zY2hlbWEuanNvbicpO1xuXG5pbXBvcnQgQVNTRU1CTFlfU0NIRU1BID0gcmVxdWlyZSgnLi4vc2NoZW1hL2Nsb3VkLWFzc2VtYmx5LnNjaGVtYS5qc29uJyk7XG5cbmltcG9ydCBJTlRFR19TQ0hFTUEgPSByZXF1aXJlKCcuLi9zY2hlbWEvaW50ZWcuc2NoZW1hLmpzb24nKTtcblxuLyoqXG4gKiBWZXJzaW9uIGlzIHNoYXJlZCBmb3IgYm90aCBtYW5pZmVzdHNcbiAqL1xuaW1wb3J0IFNDSEVNQV9WRVJTSU9OID0gcmVxdWlyZSgnLi4vc2NoZW1hL3ZlcnNpb24uanNvbicpO1xuXG4vKipcbiAqIE9wdGlvbnMgZm9yIHRoZSBsb2FkTWFuaWZlc3Qgb3BlcmF0aW9uXG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgTG9hZE1hbmlmZXN0T3B0aW9ucyB7XG4gIC8qKlxuICAgKiBTa2lwIHRoZSB2ZXJzaW9uIGNoZWNrXG4gICAqXG4gICAqIFRoaXMgbWVhbnMgeW91IG1heSByZWFkIGEgbmV3ZXIgY2xvdWQgYXNzZW1ibHkgdGhhbiB0aGUgQ1ggQVBJIGlzIGRlc2lnbmVkXG4gICAqIHRvIHN1cHBvcnQsIGFuZCB5b3VyIGFwcGxpY2F0aW9uIG1heSBub3QgYmUgYXdhcmUgb2YgYWxsIGZlYXR1cmVzIHRoYXQgaW4gdXNlXG4gICAqIGluIHRoZSBDbG91ZCBBc3NlbWJseS5cbiAgICpcbiAgICogQGRlZmF1bHQgZmFsc2VcbiAgICovXG4gIHJlYWRvbmx5IHNraXBWZXJzaW9uQ2hlY2s/OiBib29sZWFuO1xuXG4gIC8qKlxuICAgKiBTa2lwIGVudW0gY2hlY2tzXG4gICAqXG4gICAqIFRoaXMgbWVhbnMgeW91IG1heSByZWFkIGVudW0gdmFsdWVzIHlvdSBkb24ndCBrbm93IGFib3V0IHlldC4gTWFrZSBzdXJlIHRvIGFsd2F5c1xuICAgKiBjaGVjayB0aGUgdmFsdWVzIG9mIGVudW1zIHlvdSBlbmNvdW50ZXIgaW4gdGhlIG1hbmlmZXN0LlxuICAgKlxuICAgKiBAZGVmYXVsdCBmYWxzZVxuICAgKi9cbiAgcmVhZG9ubHkgc2tpcEVudW1DaGVjaz86IGJvb2xlYW47XG5cbiAgLyoqXG4gICAqIFRvcG9sb2dpY2FsbHkgc29ydCBhbGwgYXJ0aWZhY3RzXG4gICAqXG4gICAqIFRoaXMgcGFyYW1ldGVyIGlzIG9ubHkgcmVzcGVjdGVkIGJ5IHRoZSBjb25zdHJ1Y3RvciBvZiBgQ2xvdWRBc3NlbWJseWAuIFRoZVxuICAgKiBwcm9wZXJ0eSBsaXZlcyBoZXJlIGZvciBiYWNrd2FyZHMgY29tcGF0aWJpbGl0eSByZWFzb25zLlxuICAgKlxuICAgKiBAZGVmYXVsdCB0cnVlXG4gICAqL1xuICByZWFkb25seSB0b3BvU29ydD86IGJvb2xlYW47XG59XG5cbi8qKlxuICogUHJvdG9jb2wgdXRpbGl0eSBjbGFzcy5cbiAqL1xuZXhwb3J0IGNsYXNzIE1hbmlmZXN0IHtcbiAgLyoqXG4gICAqIFZhbGlkYXRlcyBhbmQgc2F2ZXMgdGhlIGNsb3VkIGFzc2VtYmx5IG1hbmlmZXN0IHRvIGZpbGUuXG4gICAqXG4gICAqIEBwYXJhbSBtYW5pZmVzdCAtIG1hbmlmZXN0LlxuICAgKiBAcGFyYW0gZmlsZVBhdGggLSBvdXRwdXQgZmlsZSBwYXRoLlxuICAgKi9cbiAgcHVibGljIHN0YXRpYyBzYXZlQXNzZW1ibHlNYW5pZmVzdChtYW5pZmVzdDogYXNzZW1ibHkuQXNzZW1ibHlNYW5pZmVzdCwgZmlsZVBhdGg6IHN0cmluZykge1xuICAgIE1hbmlmZXN0LnNhdmVNYW5pZmVzdChtYW5pZmVzdCwgZmlsZVBhdGgsIEFTU0VNQkxZX1NDSEVNQSwgTWFuaWZlc3QucGF0Y2hTdGFja1RhZ3NPbldyaXRlKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBMb2FkIGFuZCB2YWxpZGF0ZXMgdGhlIGNsb3VkIGFzc2VtYmx5IG1hbmlmZXN0IGZyb20gZmlsZS5cbiAgICpcbiAgICogQHBhcmFtIGZpbGVQYXRoIC0gcGF0aCB0byB0aGUgbWFuaWZlc3QgZmlsZS5cbiAgICovXG4gIHB1YmxpYyBzdGF0aWMgbG9hZEFzc2VtYmx5TWFuaWZlc3QoXG4gICAgZmlsZVBhdGg6IHN0cmluZyxcbiAgICBvcHRpb25zPzogTG9hZE1hbmlmZXN0T3B0aW9uc1xuICApOiBhc3NlbWJseS5Bc3NlbWJseU1hbmlmZXN0IHtcbiAgICByZXR1cm4gTWFuaWZlc3QubG9hZE1hbmlmZXN0KGZpbGVQYXRoLCBBU1NFTUJMWV9TQ0hFTUEsIE1hbmlmZXN0LnBhdGNoU3RhY2tUYWdzT25SZWFkLCBvcHRpb25zKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBWYWxpZGF0ZXMgYW5kIHNhdmVzIHRoZSBhc3NldCBtYW5pZmVzdCB0byBmaWxlLlxuICAgKlxuICAgKiBAcGFyYW0gbWFuaWZlc3QgLSBtYW5pZmVzdC5cbiAgICogQHBhcmFtIGZpbGVQYXRoIC0gb3V0cHV0IGZpbGUgcGF0aC5cbiAgICovXG4gIHB1YmxpYyBzdGF0aWMgc2F2ZUFzc2V0TWFuaWZlc3QobWFuaWZlc3Q6IGFzc2V0cy5Bc3NldE1hbmlmZXN0LCBmaWxlUGF0aDogc3RyaW5nKSB7XG4gICAgTWFuaWZlc3Quc2F2ZU1hbmlmZXN0KG1hbmlmZXN0LCBmaWxlUGF0aCwgQVNTRVRTX1NDSEVNQSwgTWFuaWZlc3QucGF0Y2hTdGFja1RhZ3NPblJlYWQpO1xuICB9XG5cbiAgLyoqXG4gICAqIExvYWQgYW5kIHZhbGlkYXRlcyB0aGUgYXNzZXQgbWFuaWZlc3QgZnJvbSBmaWxlLlxuICAgKlxuICAgKiBAcGFyYW0gZmlsZVBhdGggLSBwYXRoIHRvIHRoZSBtYW5pZmVzdCBmaWxlLlxuICAgKi9cbiAgcHVibGljIHN0YXRpYyBsb2FkQXNzZXRNYW5pZmVzdChmaWxlUGF0aDogc3RyaW5nKTogYXNzZXRzLkFzc2V0TWFuaWZlc3Qge1xuICAgIHJldHVybiB0aGlzLmxvYWRNYW5pZmVzdChmaWxlUGF0aCwgQVNTRVRTX1NDSEVNQSk7XG4gIH1cblxuICAvKipcbiAgICogVmFsaWRhdGVzIGFuZCBzYXZlcyB0aGUgaW50ZWcgbWFuaWZlc3QgdG8gZmlsZS5cbiAgICpcbiAgICogQHBhcmFtIG1hbmlmZXN0IC0gbWFuaWZlc3QuXG4gICAqIEBwYXJhbSBmaWxlUGF0aCAtIG91dHB1dCBmaWxlIHBhdGguXG4gICAqL1xuICBwdWJsaWMgc3RhdGljIHNhdmVJbnRlZ01hbmlmZXN0KG1hbmlmZXN0OiBpbnRlZy5JbnRlZ01hbmlmZXN0LCBmaWxlUGF0aDogc3RyaW5nKSB7XG4gICAgTWFuaWZlc3Quc2F2ZU1hbmlmZXN0KG1hbmlmZXN0LCBmaWxlUGF0aCwgSU5URUdfU0NIRU1BKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBMb2FkIGFuZCB2YWxpZGF0ZXMgdGhlIGludGVnIG1hbmlmZXN0IGZyb20gZmlsZS5cbiAgICpcbiAgICogQHBhcmFtIGZpbGVQYXRoIC0gcGF0aCB0byB0aGUgbWFuaWZlc3QgZmlsZS5cbiAgICovXG4gIHB1YmxpYyBzdGF0aWMgbG9hZEludGVnTWFuaWZlc3QoZmlsZVBhdGg6IHN0cmluZyk6IGludGVnLkludGVnTWFuaWZlc3Qge1xuICAgIGNvbnN0IG1hbmlmZXN0ID0gdGhpcy5sb2FkTWFuaWZlc3QoZmlsZVBhdGgsIElOVEVHX1NDSEVNQSk7XG5cbiAgICAvLyBBZGRpbmcgdHlwaW5nIHRvIGB2YWxpZGF0ZSgpYCBsZWQgdG8gYGxvYWRNYW5pZmVzdCgpYCB0byBwcm9wZXJseSBpbmZlclxuICAgIC8vIGl0cyByZXR1cm4gdHlwZSwgd2hpY2ggaW5kaWNhdGVkIHRoYXQgdGhlIHJldHVybiB0eXBlIG9mIHRoaXNcbiAgICAvLyBmdW5jdGlvbiBtYXkgYmUgYSBsaWUuIEkgY291bGQgY2hhbmdlIHRoZSBzY2hlbWEgdG8gbWFrZSBgdGVzdENhc2VzYFxuICAgIC8vIG9wdGlvbmFsLCBidXQgdGhhdCB3aWxsIGJ1bXAgdGhlIG1ham9yIHZlcnNpb24gb2YgdGhpcyBwYWNrYWdlIGFuZCBJXG4gICAgLy8gZG9uJ3Qgd2FudCB0byBkbyB0aGF0LiBTbyBpbnN0ZWFkLCBqdXN0IG1ha2Ugc3VyZSBgdGVzdENhc2VzYCBpcyBhbHdheXMgdGhlcmUuXG4gICAgcmV0dXJuIHtcbiAgICAgIC4uLm1hbmlmZXN0LFxuICAgICAgdGVzdENhc2VzOiAobWFuaWZlc3QgYXMgYW55KS50ZXN0Q2FzZXMgPz8gW10sXG4gICAgfTtcbiAgfVxuXG4gIC8qKlxuICAgKiBGZXRjaCB0aGUgY3VycmVudCBzY2hlbWEgdmVyc2lvbiBudW1iZXIuXG4gICAqL1xuICBwdWJsaWMgc3RhdGljIHZlcnNpb24oKTogc3RyaW5nIHtcbiAgICByZXR1cm4gYCR7U0NIRU1BX1ZFUlNJT04ucmV2aXNpb259LjAuMGA7XG4gIH1cblxuICAvKipcbiAgICogRGVwcmVjYXRlZFxuICAgKiBAZGVwcmVjYXRlZCB1c2UgYHNhdmVBc3NlbWJseU1hbmlmZXN0KClgXG4gICAqL1xuICBwdWJsaWMgc3RhdGljIHNhdmUobWFuaWZlc3Q6IGFzc2VtYmx5LkFzc2VtYmx5TWFuaWZlc3QsIGZpbGVQYXRoOiBzdHJpbmcpIHtcbiAgICByZXR1cm4gdGhpcy5zYXZlQXNzZW1ibHlNYW5pZmVzdChtYW5pZmVzdCwgZmlsZVBhdGgpO1xuICB9XG5cbiAgLyoqXG4gICAqIERlcHJlY2F0ZWRcbiAgICogQGRlcHJlY2F0ZWQgdXNlIGBsb2FkQXNzZW1ibHlNYW5pZmVzdCgpYFxuICAgKi9cbiAgcHVibGljIHN0YXRpYyBsb2FkKGZpbGVQYXRoOiBzdHJpbmcpOiBhc3NlbWJseS5Bc3NlbWJseU1hbmlmZXN0IHtcbiAgICByZXR1cm4gdGhpcy5sb2FkQXNzZW1ibHlNYW5pZmVzdChmaWxlUGF0aCk7XG4gIH1cblxuICBwcml2YXRlIHN0YXRpYyB2YWxpZGF0ZShcbiAgICBtYW5pZmVzdDogYW55LFxuICAgIHNjaGVtYToganNvbnNjaGVtYS5TY2hlbWEsXG4gICAgb3B0aW9ucz86IExvYWRNYW5pZmVzdE9wdGlvbnNcbiAgKTogYXNzZXJ0cyBtYW5pZmVzdCBpcyBhc3NlbWJseS5Bc3NlbWJseU1hbmlmZXN0IHtcbiAgICBmdW5jdGlvbiBwYXJzZVZlcnNpb24odmVyc2lvbjogc3RyaW5nKSB7XG4gICAgICBjb25zdCB2ZXIgPSBzZW12ZXIudmFsaWQodmVyc2lvbik7XG4gICAgICBpZiAoIXZlcikge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYEludmFsaWQgc2VtdmVyIHN0cmluZzogXCIke3ZlcnNpb259XCJgKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiB2ZXI7XG4gICAgfVxuXG4gICAgY29uc3QgbWF4U3VwcG9ydGVkID0gc2VtdmVyLm1ham9yKHBhcnNlVmVyc2lvbihNYW5pZmVzdC52ZXJzaW9uKCkpKTtcbiAgICBjb25zdCBhY3R1YWwgPSBwYXJzZVZlcnNpb24obWFuaWZlc3QudmVyc2lvbik7XG5cbiAgICAvLyBmaXJzdCB2YWxpZGF0ZSB0aGUgdmVyc2lvbiBzaG91bGQgYmUgYWNjZXB0ZWQuIGFsbCB2ZXJzaW9ucyB3aXRoaW4gdGhlIHNhbWUgbWlub3IgdmVyc2lvbiBhcmUgZmluZVxuICAgIGlmIChtYXhTdXBwb3J0ZWQgPCBzZW12ZXIubWFqb3IoYWN0dWFsKSAmJiAhb3B0aW9ucz8uc2tpcFZlcnNpb25DaGVjaykge1xuICAgICAgLy8gSWYgd2UgaGF2ZSBhIG1vcmUgc3BlY2lmaWMgZXJyb3IgdG8gdGhyb3cgdGhhbiB0aGUgZ2VuZXJpYyBvbmUgYmVsb3csIG1ha2Ugc3VyZSB0byBhZGQgdGhhdCBpbmZvLlxuICAgICAgY29uc3QgY2xpVmVyc2lvbiA9IChtYW5pZmVzdCBhcyBhc3NlbWJseS5Bc3NlbWJseU1hbmlmZXN0KS5taW5pbXVtQ2xpVmVyc2lvbjtcbiAgICAgIGxldCBjbGlXYXJuaW5nID0gJyc7XG4gICAgICBpZiAoY2xpVmVyc2lvbikge1xuICAgICAgICBjbGlXYXJuaW5nID0gYC4gWW91IG5lZWQgYXQgbGVhc3QgQ0xJIHZlcnNpb24gJHtjbGlWZXJzaW9ufSB0byByZWFkIHRoaXMgbWFuaWZlc3QuYDtcbiAgICAgIH1cblxuICAgICAgLy8gd2UgdXNlIGEgd2VsbCBrbm93biBlcnJvciBwcmVmaXggc28gdGhhdCB0aGUgQ0xJIGNhbiBpZGVudGlmeSB0aGlzIHNwZWNpZmljIGVycm9yXG4gICAgICAvLyBhbmQgcHJpbnQgc29tZSBtb3JlIGNvbnRleHQgdG8gdGhlIHVzZXIuXG4gICAgICB0aHJvdyBuZXcgRXJyb3IoXG4gICAgICAgIGAke1ZFUlNJT05fTUlTTUFUQ0h9OiBNYXhpbXVtIHNjaGVtYSB2ZXJzaW9uIHN1cHBvcnRlZCBpcyAke21heFN1cHBvcnRlZH0ueC54LCBidXQgZm91bmQgJHthY3R1YWx9JHtjbGlXYXJuaW5nfWBcbiAgICAgICk7XG4gICAgfVxuXG4gICAgLy8gbm93IHZhbGlkYXRlIHRoZSBmb3JtYXQgaXMgZ29vZC5cbiAgICBjb25zdCB2YWxpZGF0b3IgPSBuZXcganNvbnNjaGVtYS5WYWxpZGF0b3IoKTtcbiAgICBjb25zdCByZXN1bHQgPSB2YWxpZGF0b3IudmFsaWRhdGUobWFuaWZlc3QsIHNjaGVtYSwge1xuICAgICAgLy8gZG9lcyBleGlzdCBidXQgaXMgbm90IGluIHRoZSBUeXBlU2NyaXB0IGRlZmluaXRpb25zXG4gICAgICBuZXN0ZWRFcnJvcnM6IHRydWUsXG5cbiAgICAgIGFsbG93VW5rbm93bkF0dHJpYnV0ZXM6IGZhbHNlLFxuICAgICAgcHJlVmFsaWRhdGVQcm9wZXJ0eTogTWFuaWZlc3QudmFsaWRhdGVBc3N1bWVSb2xlQWRkaXRpb25hbE9wdGlvbnMsXG4gICAgfSk7XG5cbiAgICBsZXQgZXJyb3JzID0gcmVzdWx0LmVycm9ycztcbiAgICBpZiAob3B0aW9ucz8uc2tpcEVudW1DaGVjaykge1xuICAgICAgLy8gRW51bSB2YWxpZGF0aW9ucyBhcmVuJ3QgdXNlZnVsIHdoZW5cbiAgICAgIGVycm9ycyA9IHN0cmlwRW51bUVycm9ycyhlcnJvcnMpO1xuICAgIH1cblxuICAgIGlmIChlcnJvcnMubGVuZ3RoID4gMCkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKGBJbnZhbGlkIGFzc2VtYmx5IG1hbmlmZXN0OlxcbiR7ZXJyb3JzLm1hcCgoZSkgPT4gZS5zdGFjaykuam9pbignXFxuJyl9YCk7XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSBzdGF0aWMgc2F2ZU1hbmlmZXN0KFxuICAgIG1hbmlmZXN0OiBhbnksXG4gICAgZmlsZVBhdGg6IHN0cmluZyxcbiAgICBzY2hlbWE6IGpzb25zY2hlbWEuU2NoZW1hLFxuICAgIHByZXByb2Nlc3M/OiAob2JqOiBhbnkpID0+IGFueVxuICApIHtcbiAgICBsZXQgd2l0aFZlcnNpb24gPSB7IC4uLm1hbmlmZXN0LCB2ZXJzaW9uOiBNYW5pZmVzdC52ZXJzaW9uKCkgfTtcbiAgICBNYW5pZmVzdC52YWxpZGF0ZSh3aXRoVmVyc2lvbiwgc2NoZW1hKTtcbiAgICBpZiAocHJlcHJvY2Vzcykge1xuICAgICAgd2l0aFZlcnNpb24gPSBwcmVwcm9jZXNzKHdpdGhWZXJzaW9uKTtcbiAgICB9XG4gICAgZnMud3JpdGVGaWxlU3luYyhmaWxlUGF0aCwgSlNPTi5zdHJpbmdpZnkod2l0aFZlcnNpb24sIHVuZGVmaW5lZCwgMikpO1xuICB9XG5cbiAgcHJpdmF0ZSBzdGF0aWMgbG9hZE1hbmlmZXN0KFxuICAgIGZpbGVQYXRoOiBzdHJpbmcsXG4gICAgc2NoZW1hOiBqc29uc2NoZW1hLlNjaGVtYSxcbiAgICBwcmVwcm9jZXNzPzogKG9iajogYW55KSA9PiBhbnksXG4gICAgb3B0aW9ucz86IExvYWRNYW5pZmVzdE9wdGlvbnNcbiAgKSB7XG4gICAgY29uc3QgY29udGVudHMgPSBmcy5yZWFkRmlsZVN5bmMoZmlsZVBhdGgsIHsgZW5jb2Rpbmc6ICd1dGYtOCcgfSk7XG4gICAgbGV0IG9iajtcbiAgICB0cnkge1xuICAgICAgb2JqID0gSlNPTi5wYXJzZShjb250ZW50cyk7XG4gICAgfSBjYXRjaCAoZTogYW55KSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoYCR7ZS5tZXNzYWdlfSwgd2hpbGUgcGFyc2luZyAke0pTT04uc3RyaW5naWZ5KGNvbnRlbnRzKX1gKTtcbiAgICB9XG4gICAgaWYgKHByZXByb2Nlc3MpIHtcbiAgICAgIG9iaiA9IHByZXByb2Nlc3Mob2JqKTtcbiAgICB9XG4gICAgTWFuaWZlc3QudmFsaWRhdGUob2JqLCBzY2hlbWEsIG9wdGlvbnMpO1xuICAgIHJldHVybiBvYmo7XG4gIH1cblxuICAvKipcbiAgICogVGhpcyByZXF1aXJlcyBzb21lIGV4cGxhaW5pbmcuLi5cbiAgICpcbiAgICogV2UgcHJldmlvdXNseSB1c2VkIGB7IEtleSwgVmFsdWUgfWAgZm9yIHRoZSBvYmplY3QgdGhhdCByZXByZXNlbnRzIGEgc3RhY2sgdGFnLiAoTm90aWNlIHRoZSBjYXNpbmcpXG4gICAqIEBsaW5rIGh0dHBzOi8vZ2l0aHViLmNvbS9hd3MvYXdzLWNkay9ibG9iL3YxLjI3LjAvcGFja2FnZXMvYXdzLWNkay9saWIvYXBpL2N4YXBwL3N0YWNrcy50cyNMNDI3LlxuICAgKlxuICAgKiBXaGVuIHRoYXQgb2JqZWN0IG1vdmVkIHRvIHRoaXMgcGFja2FnZSwgaXQgaGFkIHRvIGJlIEpTSUkgY29tcGxpYW50LCB3aGljaCBtZWFudCB0aGUgcHJvcGVydHlcbiAgICogbmFtZXMgbXVzdCBiZSBgY2FtZWxDYXNlZGAsIGFuZCBub3QgYFBhc2NhbENhc2VkYC4gVGhpcyBtZWFudCBpdCBubyBsb25nZXIgbWF0Y2hlcyB0aGUgc3RydWN0dXJlIGluIHRoZSBgbWFuaWZlc3QuanNvbmAgZmlsZS5cbiAgICogSW4gb3JkZXIgdG8gc3VwcG9ydCBjdXJyZW50IG1hbmlmZXN0IGZpbGVzLCB3ZSBoYXZlIHRvIHRyYW5zbGF0ZSB0aGUgYFBhc2NhbENhc2VkYCByZXByZXNlbnRhdGlvbiB0byB0aGUgbmV3IGBjYW1lbENhc2VkYCBvbmUuXG4gICAqXG4gICAqIE5vdGUgdGhhdCB0aGUgc2VyaWFsaXphdGlvbiBpdHNlbGYgc3RpbGwgd3JpdGVzIGBQYXNjYWxDYXNlZGAgYmVjYXVzZSBpdCByZWxhdGVzIHRvIGhvdyBDbG91ZEZvcm1hdGlvbiBleHBlY3RzIGl0LlxuICAgKlxuICAgKiBJZGVhbGx5LCB3ZSB3b3VsZCBzdGFydCB3cml0aW5nIHRoZSBgY2FtZWxDYXNlZGAgYW5kIHRyYW5zbGF0ZSB0byBob3cgQ2xvdWRGb3JtYXRpb24gZXhwZWN0cyBpdCB3aGVuIG5lZWRlZC4gQnV0IHRoaXMgcmVxdWlyZXMgbmFzdHlcbiAgICogYmFja3dhcmRzLWNvbXBhdGliaWxpdHkgY29kZSBhbmQgaXQganVzdCBkb2Vzbid0IHNlZW0gdG8gYmUgd29ydGggdGhlIGVmZm9ydC5cbiAgICovXG4gIHByaXZhdGUgc3RhdGljIHBhdGNoU3RhY2tUYWdzT25SZWFkKG1hbmlmZXN0OiBhc3NlbWJseS5Bc3NlbWJseU1hbmlmZXN0KSB7XG4gICAgcmV0dXJuIE1hbmlmZXN0LnJlcGxhY2VTdGFja1RhZ3MobWFuaWZlc3QsICh0YWdzKSA9PlxuICAgICAgdGFncy5tYXAoKGRpc2tUYWc6IGFueSkgPT4gKHtcbiAgICAgICAga2V5OiBkaXNrVGFnLktleSxcbiAgICAgICAgdmFsdWU6IGRpc2tUYWcuVmFsdWUsXG4gICAgICB9KSlcbiAgICApO1xuICB9XG5cbiAgLyoqXG4gICAqIFZhbGlkYXRlcyB0aGF0IGBhc3N1bWVSb2xlQWRkaXRpb25hbE9wdGlvbnNgIGRvZXNuJ3QgY29udGFpbiBub3IgYEV4dGVybmFsSWRgIG5laXRoZXIgYFJvbGVBcm5gLCBhcyB0aGV5XG4gICAqIHNob3VsZCBoYXZlIGRlZGljYXRlZCBwcm9wZXJ0aWVzIHByZWNlZGluZyB0aGlzIChlLmcgYGFzc3VtZVJvbGVBcm5gIGFuZCBgYXNzdW1lUm9sZUV4dGVybmFsSWRgKS5cbiAgICovXG4gIHByaXZhdGUgc3RhdGljIHZhbGlkYXRlQXNzdW1lUm9sZUFkZGl0aW9uYWxPcHRpb25zKFxuICAgIGluc3RhbmNlOiBhbnksXG4gICAga2V5OiBzdHJpbmcsXG4gICAgX3NjaGVtYToganNvbnNjaGVtYS5TY2hlbWEsXG4gICAgX29wdGlvbnM6IGpzb25zY2hlbWEuT3B0aW9ucyxcbiAgICBfY3R4OiBqc29uc2NoZW1hLlNjaGVtYUNvbnRleHRcbiAgKSB7XG4gICAgaWYgKGtleSAhPT0gJ2Fzc3VtZVJvbGVBZGRpdGlvbmFsT3B0aW9ucycpIHtcbiAgICAgIC8vIG5vdGUgdGhhdCB0aGlzIG1lYW5zIHRoYXQgaWYgd2UgaGFwcGVuIHRvIGhhdmUgYSBwcm9wZXJ0eSBuYW1lZCBsaWtlIHRoaXMsIGJ1dCB0aGF0XG4gICAgICAvLyBkb2VzIHdhbnQgdG8gYWxsb3cgJ1JvbGVBcm4nIG9yICdFeHRlcm5hbElkJywgdGhpcyBjb2RlIHdpbGwgaGF2ZSB0byBjaGFuZ2UgdG8gY29uc2lkZXIgdGhlIGZ1bGwgc2NoZW1hIHBhdGguXG4gICAgICAvLyBJIGRlY2lkZWQgdG8gbWFrZSB0aGlzIGxlc3MgZ3JhbnVsYXIgZm9yIG5vdyBvbiBwdXJwb3NlIGJlY2F1c2UgaXQgZml0cyBvdXIgbmVlZHMgYW5kIGF2b2lkcyBoYXZpbmcgbWVzc3lcbiAgICAgIC8vIHZhbGlkYXRpb24gbG9naWMgZHVlIHRvIHZhcmlvdXMgc2NoZW1hIHBhdGhzLlxuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGNvbnN0IGFzc3VtZVJvbGVPcHRpb25zID0gaW5zdGFuY2Vba2V5XTtcbiAgICBpZiAoYXNzdW1lUm9sZU9wdGlvbnM/LlJvbGVBcm4pIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihgUm9sZUFybiBpcyBub3QgYWxsb3dlZCBpbnNpZGUgJyR7a2V5fSdgKTtcbiAgICB9XG4gICAgaWYgKGFzc3VtZVJvbGVPcHRpb25zPy5FeHRlcm5hbElkKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoYEV4dGVybmFsSWQgaXMgbm90IGFsbG93ZWQgaW5zaWRlICcke2tleX0nYCk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIFNlZSBleHBsYW5hdGlvbiBvbiBgcGF0Y2hTdGFja1RhZ3NPblJlYWRgXG4gICAqXG4gICAqIFRyYW5zbGF0ZSBzdGFjayB0YWdzIG1ldGFkYXRhIGlmIGl0IGhhcyB0aGUgXCJyaWdodFwiIGNhc2luZy5cbiAgICovXG4gIHByaXZhdGUgc3RhdGljIHBhdGNoU3RhY2tUYWdzT25Xcml0ZShtYW5pZmVzdDogYXNzZW1ibHkuQXNzZW1ibHlNYW5pZmVzdCkge1xuICAgIHJldHVybiBNYW5pZmVzdC5yZXBsYWNlU3RhY2tUYWdzKG1hbmlmZXN0LCAodGFncykgPT5cbiAgICAgIHRhZ3MubWFwKFxuICAgICAgICAobWVtVGFnKSA9PlxuICAgICAgICAgIC8vIE1pZ2h0IGFscmVhZHkgYmUgdXBwZXJjYXNlZCAoYmVjYXVzZSBzdGFjayBzeW50aGVzaXMgZ2VuZXJhdGVzIGl0IGluIGZpbmFsIGZvcm0geWV0KVxuICAgICAgICAgICgnS2V5JyBpbiBtZW1UYWcgPyBtZW1UYWcgOiB7IEtleTogbWVtVGFnLmtleSwgVmFsdWU6IG1lbVRhZy52YWx1ZSB9KSBhcyBhbnlcbiAgICAgIClcbiAgICApO1xuICB9XG5cbiAgLyoqXG4gICAqIFJlY3Vyc2l2ZWx5IHJlcGxhY2Ugc3RhY2sgdGFncyBpbiB0aGUgc3RhY2sgbWV0YWRhdGFcbiAgICovXG4gIHByaXZhdGUgc3RhdGljIHJlcGxhY2VTdGFja1RhZ3MoXG4gICAgbWFuaWZlc3Q6IGFzc2VtYmx5LkFzc2VtYmx5TWFuaWZlc3QsXG4gICAgZm46IEVuZG9mdW5jdG9yPGFzc2VtYmx5LlN0YWNrVGFnc01ldGFkYXRhRW50cnk+XG4gICk6IGFzc2VtYmx5LkFzc2VtYmx5TWFuaWZlc3Qge1xuICAgIC8vIE5lZWQgdG8gYWRkIGluIHRoZSBgbm9VbmRlZmluZWRgcyBiZWNhdXNlIG90aGVyd2lzZSBqZXN0IHNuYXBzaG90IHRlc3RzIGFyZSBnb2luZyB0byBmcmVhayBvdXRcbiAgICAvLyBhYm91dCB0aGUga2V5cyB3aXRoIHZhbHVlcyB0aGF0IGFyZSBgdW5kZWZpbmVkYCAoZXZlbiB0aG91Z2ggdGhleSB3b3VsZCBuZXZlciBiZSBKU09OLnN0cmluZ2lmaWVkKVxuICAgIHJldHVybiBub1VuZGVmaW5lZCh7XG4gICAgICAuLi5tYW5pZmVzdCxcbiAgICAgIGFydGlmYWN0czogbWFwVmFsdWVzKG1hbmlmZXN0LmFydGlmYWN0cywgKGFydGlmYWN0KSA9PiB7XG4gICAgICAgIGlmIChhcnRpZmFjdC50eXBlICE9PSBhc3NlbWJseS5BcnRpZmFjdFR5cGUuQVdTX0NMT1VERk9STUFUSU9OX1NUQUNLKSB7XG4gICAgICAgICAgcmV0dXJuIGFydGlmYWN0O1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBub1VuZGVmaW5lZCh7XG4gICAgICAgICAgLi4uYXJ0aWZhY3QsXG4gICAgICAgICAgbWV0YWRhdGE6IG1hcFZhbHVlcyhhcnRpZmFjdC5tZXRhZGF0YSwgKG1ldGFkYXRhRW50cmllcykgPT5cbiAgICAgICAgICAgIG1ldGFkYXRhRW50cmllcy5tYXAoKG1ldGFkYXRhRW50cnkpID0+IHtcbiAgICAgICAgICAgICAgaWYgKFxuICAgICAgICAgICAgICAgIG1ldGFkYXRhRW50cnkudHlwZSAhPT0gYXNzZW1ibHkuQXJ0aWZhY3RNZXRhZGF0YUVudHJ5VHlwZS5TVEFDS19UQUdTIHx8XG4gICAgICAgICAgICAgICAgIW1ldGFkYXRhRW50cnkuZGF0YVxuICAgICAgICAgICAgICApIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gbWV0YWRhdGFFbnRyeTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgIC4uLm1ldGFkYXRhRW50cnksXG4gICAgICAgICAgICAgICAgZGF0YTogZm4obWV0YWRhdGFFbnRyeS5kYXRhIGFzIGFzc2VtYmx5LlN0YWNrVGFnc01ldGFkYXRhRW50cnkpLFxuICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgfSlcbiAgICAgICAgICApLFxuICAgICAgICB9IGFzIGFzc2VtYmx5LkFydGlmYWN0TWFuaWZlc3QpO1xuICAgICAgfSksXG4gICAgfSk7XG4gIH1cblxuICBwcml2YXRlIGNvbnN0cnVjdG9yKCkge31cbn1cblxudHlwZSBFbmRvZnVuY3RvcjxBPiA9ICh4OiBBKSA9PiBBO1xuXG5mdW5jdGlvbiBtYXBWYWx1ZXM8QSwgQj4oXG4gIHhzOiBSZWNvcmQ8c3RyaW5nLCBBPiB8IHVuZGVmaW5lZCxcbiAgZm46ICh4OiBBKSA9PiBCXG4pOiBSZWNvcmQ8c3RyaW5nLCBCPiB8IHVuZGVmaW5lZCB7XG4gIGlmICgheHMpIHtcbiAgICByZXR1cm4gdW5kZWZpbmVkO1xuICB9XG4gIGNvbnN0IHJldDogUmVjb3JkPHN0cmluZywgQj4gfCB1bmRlZmluZWQgPSB7fTtcbiAgZm9yIChjb25zdCBbaywgdl0gb2YgT2JqZWN0LmVudHJpZXMoeHMpKSB7XG4gICAgcmV0W2tdID0gZm4odik7XG4gIH1cbiAgcmV0dXJuIHJldDtcbn1cblxuZnVuY3Rpb24gbm9VbmRlZmluZWQ8QSBleHRlbmRzIG9iamVjdD4oeHM6IEEpOiBBIHtcbiAgY29uc3QgcmV0OiBhbnkgPSB7fTtcbiAgZm9yIChjb25zdCBbaywgdl0gb2YgT2JqZWN0LmVudHJpZXMoeHMpKSB7XG4gICAgaWYgKHYgIT09IHVuZGVmaW5lZCkge1xuICAgICAgcmV0W2tdID0gdjtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIHJldDtcbn1cblxuZnVuY3Rpb24gc3RyaXBFbnVtRXJyb3JzKGVycm9yczoganNvbnNjaGVtYS5WYWxpZGF0aW9uRXJyb3JbXSkge1xuICByZXR1cm4gZXJyb3JzLmZpbHRlcigoZSkgPT4gdHlwZW9mIGUuc2NoZW1hID09PSAnc3RyaW5nJyB8fCAhKCdlbnVtJyBpbiBlLnNjaGVtYSkpO1xufVxuIl19