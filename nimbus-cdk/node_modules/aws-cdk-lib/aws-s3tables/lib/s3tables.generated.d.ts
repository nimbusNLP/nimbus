import * as cdk from "../../core";
import * as constructs from "constructs";
import * as cfn_parse from "../../core/lib/helpers-internal";
/**
 * Creates a table bucket.
 *
 * For more information, see [Creating a table bucket](https://docs.aws.amazon.com/AmazonS3/latest/userguide/s3-tables-buckets-create.html) in the *Amazon Simple Storage Service User Guide* .
 *
 * - **Permissions** - You must have the `s3tables:CreateTableBucket` permission to use this operation.
 *
 * @cloudformationResource AWS::S3Tables::TableBucket
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-s3tables-tablebucket.html
 */
export declare class CfnTableBucket extends cdk.CfnResource implements cdk.IInspectable {
    /**
     * The CloudFormation resource type name for this resource class.
     */
    static readonly CFN_RESOURCE_TYPE_NAME: string;
    /**
     * Build a CfnTableBucket from CloudFormation properties
     *
     * A factory method that creates a new instance of this class from an object
     * containing the CloudFormation properties of this resource.
     * Used in the @aws-cdk/cloudformation-include module.
     *
     * @internal
     */
    static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnTableBucket;
    /**
     * The Amazon Resource Name (ARN) of the table bucket.
     *
     * @cloudformationAttribute TableBucketARN
     */
    readonly attrTableBucketArn: string;
    /**
     * The name for the table bucket.
     */
    tableBucketName: string;
    /**
     * The unreferenced file removal settings for your table bucket.
     */
    unreferencedFileRemoval?: cdk.IResolvable | CfnTableBucket.UnreferencedFileRemovalProperty;
    /**
     * @param scope Scope in which this resource is defined
     * @param id Construct identifier for this resource (unique in its scope)
     * @param props Resource properties
     */
    constructor(scope: constructs.Construct, id: string, props: CfnTableBucketProps);
    protected get cfnProperties(): Record<string, any>;
    /**
     * Examines the CloudFormation resource and discloses attributes
     *
     * @param inspector tree inspector to collect and process attributes
     */
    inspect(inspector: cdk.TreeInspector): void;
    protected renderProperties(props: Record<string, any>): Record<string, any>;
}
export declare namespace CfnTableBucket {
    /**
     * The unreferenced file removal settings for your table bucket.
     *
     * Unreferenced file removal identifies and deletes all objects that are not referenced by any table snapshots. For more information, see the [*Amazon S3 User Guide*](https://docs.aws.amazon.com/AmazonS3/latest/userguide/s3-table-buckets-maintenance.html) .
     *
     * @struct
     * @stability external
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3tables-tablebucket-unreferencedfileremoval.html
     */
    interface UnreferencedFileRemovalProperty {
        /**
         * The number of days an object can be noncurrent before Amazon S3 deletes it.
         *
         * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3tables-tablebucket-unreferencedfileremoval.html#cfn-s3tables-tablebucket-unreferencedfileremoval-noncurrentdays
         */
        readonly noncurrentDays?: number;
        /**
         * The status of the unreferenced file removal configuration for your table bucket.
         *
         * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3tables-tablebucket-unreferencedfileremoval.html#cfn-s3tables-tablebucket-unreferencedfileremoval-status
         */
        readonly status?: string;
        /**
         * The number of days an object must be unreferenced by your table before Amazon S3 marks the object as noncurrent.
         *
         * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3tables-tablebucket-unreferencedfileremoval.html#cfn-s3tables-tablebucket-unreferencedfileremoval-unreferenceddays
         */
        readonly unreferencedDays?: number;
    }
}
/**
 * Properties for defining a `CfnTableBucket`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-s3tables-tablebucket.html
 */
export interface CfnTableBucketProps {
    /**
     * The name for the table bucket.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-s3tables-tablebucket.html#cfn-s3tables-tablebucket-tablebucketname
     */
    readonly tableBucketName: string;
    /**
     * The unreferenced file removal settings for your table bucket.
     *
     * Unreferenced file removal identifies and deletes all objects that are not referenced by any table snapshots. For more information, see the [*Amazon S3 User Guide*](https://docs.aws.amazon.com/AmazonS3/latest/userguide/s3-table-buckets-maintenance.html) .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-s3tables-tablebucket.html#cfn-s3tables-tablebucket-unreferencedfileremoval
     */
    readonly unreferencedFileRemoval?: cdk.IResolvable | CfnTableBucket.UnreferencedFileRemovalProperty;
}
/**
 * Creates a new maintenance configuration or replaces an existing table bucket policy for a table bucket.
 *
 * For more information, see [Adding a table bucket policy](https://docs.aws.amazon.com/AmazonS3/latest/userguide/s3-tables-bucket-policy.html#table-bucket-policy-add) in the *Amazon Simple Storage Service User Guide* .
 *
 * - **Permissions** - You must have the `s3tables:PutTableBucketPolicy` permission to use this operation.
 *
 * @cloudformationResource AWS::S3Tables::TableBucketPolicy
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-s3tables-tablebucketpolicy.html
 */
export declare class CfnTableBucketPolicy extends cdk.CfnResource implements cdk.IInspectable {
    /**
     * The CloudFormation resource type name for this resource class.
     */
    static readonly CFN_RESOURCE_TYPE_NAME: string;
    /**
     * Build a CfnTableBucketPolicy from CloudFormation properties
     *
     * A factory method that creates a new instance of this class from an object
     * containing the CloudFormation properties of this resource.
     * Used in the @aws-cdk/cloudformation-include module.
     *
     * @internal
     */
    static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnTableBucketPolicy;
    /**
     * The bucket policy JSON for the table bucket.
     */
    resourcePolicy: any | cdk.IResolvable | string;
    /**
     * The Amazon Resource Name (ARN) of the table bucket.
     */
    tableBucketArn: string;
    /**
     * @param scope Scope in which this resource is defined
     * @param id Construct identifier for this resource (unique in its scope)
     * @param props Resource properties
     */
    constructor(scope: constructs.Construct, id: string, props: CfnTableBucketPolicyProps);
    protected get cfnProperties(): Record<string, any>;
    /**
     * Examines the CloudFormation resource and discloses attributes
     *
     * @param inspector tree inspector to collect and process attributes
     */
    inspect(inspector: cdk.TreeInspector): void;
    protected renderProperties(props: Record<string, any>): Record<string, any>;
}
/**
 * Properties for defining a `CfnTableBucketPolicy`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-s3tables-tablebucketpolicy.html
 */
export interface CfnTableBucketPolicyProps {
    /**
     * The bucket policy JSON for the table bucket.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-s3tables-tablebucketpolicy.html#cfn-s3tables-tablebucketpolicy-resourcepolicy
     */
    readonly resourcePolicy: any | cdk.IResolvable | string;
    /**
     * The Amazon Resource Name (ARN) of the table bucket.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-s3tables-tablebucketpolicy.html#cfn-s3tables-tablebucketpolicy-tablebucketarn
     */
    readonly tableBucketArn: string;
}
