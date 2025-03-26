import * as cdk from "../../core";
import * as constructs from "constructs";
import * as cfn_parse from "../../core/lib/helpers-internal";
/**
 * The `AWS::AccessAnalyzer::Analyzer` resource specifies a new analyzer.
 *
 * The analyzer is an object that represents the IAM Access Analyzer feature. An analyzer is required for Access Analyzer to become operational.
 *
 * @cloudformationResource AWS::AccessAnalyzer::Analyzer
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-accessanalyzer-analyzer.html
 */
export declare class CfnAnalyzer extends cdk.CfnResource implements cdk.IInspectable, cdk.ITaggable {
    /**
     * The CloudFormation resource type name for this resource class.
     */
    static readonly CFN_RESOURCE_TYPE_NAME: string;
    /**
     * Build a CfnAnalyzer from CloudFormation properties
     *
     * A factory method that creates a new instance of this class from an object
     * containing the CloudFormation properties of this resource.
     * Used in the @aws-cdk/cloudformation-include module.
     *
     * @internal
     */
    static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnAnalyzer;
    /**
     * The ARN of the analyzer that was created.
     *
     * @cloudformationAttribute Arn
     */
    readonly attrArn: string;
    /**
     * Contains information about the configuration of an analyzer for an AWS organization or account.
     */
    analyzerConfiguration?: CfnAnalyzer.AnalyzerConfigurationProperty | cdk.IResolvable;
    /**
     * The name of the analyzer.
     */
    analyzerName?: string;
    /**
     * Specifies the archive rules to add for the analyzer.
     */
    archiveRules?: Array<CfnAnalyzer.ArchiveRuleProperty | cdk.IResolvable> | cdk.IResolvable;
    /**
     * Tag Manager which manages the tags for this resource
     */
    readonly tags: cdk.TagManager;
    /**
     * An array of key-value pairs to apply to the analyzer.
     */
    tagsRaw?: Array<cdk.CfnTag>;
    /**
     * The type represents the zone of trust for the analyzer.
     */
    type: string;
    /**
     * @param scope Scope in which this resource is defined
     * @param id Construct identifier for this resource (unique in its scope)
     * @param props Resource properties
     */
    constructor(scope: constructs.Construct, id: string, props: CfnAnalyzerProps);
    protected get cfnProperties(): Record<string, any>;
    /**
     * Examines the CloudFormation resource and discloses attributes
     *
     * @param inspector tree inspector to collect and process attributes
     */
    inspect(inspector: cdk.TreeInspector): void;
    protected renderProperties(props: Record<string, any>): Record<string, any>;
}
export declare namespace CfnAnalyzer {
    /**
     * Contains information about an archive rule.
     *
     * Archive rules automatically archive new findings that meet the criteria you define when you create the rule.
     *
     * @struct
     * @stability external
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-accessanalyzer-analyzer-archiverule.html
     */
    interface ArchiveRuleProperty {
        /**
         * The criteria for the rule.
         *
         * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-accessanalyzer-analyzer-archiverule.html#cfn-accessanalyzer-analyzer-archiverule-filter
         */
        readonly filter: Array<CfnAnalyzer.FilterProperty | cdk.IResolvable> | cdk.IResolvable;
        /**
         * The name of the rule to create.
         *
         * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-accessanalyzer-analyzer-archiverule.html#cfn-accessanalyzer-analyzer-archiverule-rulename
         */
        readonly ruleName: string;
    }
    /**
     * The criteria that defines the archive rule.
     *
     * To learn about filter keys that you can use to create an archive rule, see [filter keys](https://docs.aws.amazon.com/IAM/latest/UserGuide/access-analyzer-reference-filter-keys.html) in the *User Guide* .
     *
     * @struct
     * @stability external
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-accessanalyzer-analyzer-filter.html
     */
    interface FilterProperty {
        /**
         * A "contains" condition to match for the rule.
         *
         * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-accessanalyzer-analyzer-filter.html#cfn-accessanalyzer-analyzer-filter-contains
         */
        readonly contains?: Array<string>;
        /**
         * An "equals" condition to match for the rule.
         *
         * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-accessanalyzer-analyzer-filter.html#cfn-accessanalyzer-analyzer-filter-eq
         */
        readonly eq?: Array<string>;
        /**
         * An "exists" condition to match for the rule.
         *
         * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-accessanalyzer-analyzer-filter.html#cfn-accessanalyzer-analyzer-filter-exists
         */
        readonly exists?: boolean | cdk.IResolvable;
        /**
         * A "not equal" condition to match for the rule.
         *
         * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-accessanalyzer-analyzer-filter.html#cfn-accessanalyzer-analyzer-filter-neq
         */
        readonly neq?: Array<string>;
        /**
         * The property used to define the criteria in the filter for the rule.
         *
         * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-accessanalyzer-analyzer-filter.html#cfn-accessanalyzer-analyzer-filter-property
         */
        readonly property: string;
    }
    /**
     * Contains information about the configuration of an analyzer for an AWS organization or account.
     *
     * @struct
     * @stability external
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-accessanalyzer-analyzer-analyzerconfiguration.html
     */
    interface AnalyzerConfigurationProperty {
        /**
         * Specifies the configuration of an unused access analyzer for an AWS organization or account.
         *
         * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-accessanalyzer-analyzer-analyzerconfiguration.html#cfn-accessanalyzer-analyzer-analyzerconfiguration-unusedaccessconfiguration
         */
        readonly unusedAccessConfiguration?: cdk.IResolvable | CfnAnalyzer.UnusedAccessConfigurationProperty;
    }
    /**
     * Contains information about an unused access analyzer.
     *
     * @struct
     * @stability external
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-accessanalyzer-analyzer-unusedaccessconfiguration.html
     */
    interface UnusedAccessConfigurationProperty {
        /**
         * Contains information about analysis rules for the analyzer.
         *
         * Analysis rules determine which entities will generate findings based on the criteria you define when you create the rule.
         *
         * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-accessanalyzer-analyzer-unusedaccessconfiguration.html#cfn-accessanalyzer-analyzer-unusedaccessconfiguration-analysisrule
         */
        readonly analysisRule?: CfnAnalyzer.AnalysisRuleProperty | cdk.IResolvable;
        /**
         * The specified access age in days for which to generate findings for unused access.
         *
         * For example, if you specify 90 days, the analyzer will generate findings for IAM entities within the accounts of the selected organization for any access that hasn't been used in 90 or more days since the analyzer's last scan. You can choose a value between 1 and 365 days.
         *
         * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-accessanalyzer-analyzer-unusedaccessconfiguration.html#cfn-accessanalyzer-analyzer-unusedaccessconfiguration-unusedaccessage
         */
        readonly unusedAccessAge?: number;
    }
    /**
     * Contains information about analysis rules for the analyzer.
     *
     * Analysis rules determine which entities will generate findings based on the criteria you define when you create the rule.
     *
     * @struct
     * @stability external
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-accessanalyzer-analyzer-analysisrule.html
     */
    interface AnalysisRuleProperty {
        /**
         * A list of rules for the analyzer containing criteria to exclude from analysis.
         *
         * Entities that meet the rule criteria will not generate findings.
         *
         * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-accessanalyzer-analyzer-analysisrule.html#cfn-accessanalyzer-analyzer-analysisrule-exclusions
         */
        readonly exclusions?: Array<CfnAnalyzer.AnalysisRuleCriteriaProperty | cdk.IResolvable> | cdk.IResolvable;
    }
    /**
     * The criteria for an analysis rule for an analyzer.
     *
     * The criteria determine which entities will generate findings.
     *
     * @struct
     * @stability external
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-accessanalyzer-analyzer-analysisrulecriteria.html
     */
    interface AnalysisRuleCriteriaProperty {
        /**
         * A list of AWS account IDs to apply to the analysis rule criteria.
         *
         * The accounts cannot include the organization analyzer owner account. Account IDs can only be applied to the analysis rule criteria for organization-level analyzers. The list cannot include more than 2,000 account IDs.
         *
         * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-accessanalyzer-analyzer-analysisrulecriteria.html#cfn-accessanalyzer-analyzer-analysisrulecriteria-accountids
         */
        readonly accountIds?: Array<string>;
        /**
         * An array of key-value pairs to match for your resources.
         *
         * You can use the set of Unicode letters, digits, whitespace, `_` , `.` , `/` , `=` , `+` , and `-` .
         *
         * For the tag key, you can specify a value that is 1 to 128 characters in length and cannot be prefixed with `aws:` .
         *
         * For the tag value, you can specify a value that is 0 to 256 characters in length. If the specified tag value is 0 characters, the rule is applied to all principals with the specified tag key.
         *
         * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-accessanalyzer-analyzer-analysisrulecriteria.html#cfn-accessanalyzer-analyzer-analysisrulecriteria-resourcetags
         */
        readonly resourceTags?: Array<Array<cdk.CfnTag | cdk.IResolvable> | cdk.IResolvable> | cdk.IResolvable;
    }
}
/**
 * Properties for defining a `CfnAnalyzer`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-accessanalyzer-analyzer.html
 */
export interface CfnAnalyzerProps {
    /**
     * Contains information about the configuration of an analyzer for an AWS organization or account.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-accessanalyzer-analyzer.html#cfn-accessanalyzer-analyzer-analyzerconfiguration
     */
    readonly analyzerConfiguration?: CfnAnalyzer.AnalyzerConfigurationProperty | cdk.IResolvable;
    /**
     * The name of the analyzer.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-accessanalyzer-analyzer.html#cfn-accessanalyzer-analyzer-analyzername
     */
    readonly analyzerName?: string;
    /**
     * Specifies the archive rules to add for the analyzer.
     *
     * Archive rules automatically archive findings that meet the criteria you define for the rule.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-accessanalyzer-analyzer.html#cfn-accessanalyzer-analyzer-archiverules
     */
    readonly archiveRules?: Array<CfnAnalyzer.ArchiveRuleProperty | cdk.IResolvable> | cdk.IResolvable;
    /**
     * An array of key-value pairs to apply to the analyzer.
     *
     * You can use the set of Unicode letters, digits, whitespace, `_` , `.` , `/` , `=` , `+` , and `-` .
     *
     * For the tag key, you can specify a value that is 1 to 128 characters in length and cannot be prefixed with `aws:` .
     *
     * For the tag value, you can specify a value that is 0 to 256 characters in length.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-accessanalyzer-analyzer.html#cfn-accessanalyzer-analyzer-tags
     */
    readonly tags?: Array<cdk.CfnTag>;
    /**
     * The type represents the zone of trust for the analyzer.
     *
     * *Allowed Values* : ACCOUNT | ORGANIZATION | ACCOUNT_UNUSED_ACCESS | ORGANIZATION_UNUSED_ACCESS
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-accessanalyzer-analyzer.html#cfn-accessanalyzer-analyzer-type
     */
    readonly type: string;
}
