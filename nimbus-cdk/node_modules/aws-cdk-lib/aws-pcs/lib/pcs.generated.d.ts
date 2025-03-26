import * as cdk from "../../core";
import * as constructs from "constructs";
import * as cfn_parse from "../../core/lib/helpers-internal";
/**
 * The `AWS::PCS::Cluster` resource creates an AWS PCS cluster.
 *
 * @cloudformationResource AWS::PCS::Cluster
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-pcs-cluster.html
 */
export declare class CfnCluster extends cdk.CfnResource implements cdk.IInspectable, cdk.ITaggableV2 {
    /**
     * The CloudFormation resource type name for this resource class.
     */
    static readonly CFN_RESOURCE_TYPE_NAME: string;
    /**
     * Build a CfnCluster from CloudFormation properties
     *
     * A factory method that creates a new instance of this class from an object
     * containing the CloudFormation properties of this resource.
     * Used in the @aws-cdk/cloudformation-include module.
     *
     * @internal
     */
    static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnCluster;
    /**
     * The unique Amazon Resource Name (ARN) of the cluster.
     *
     * @cloudformationAttribute Arn
     */
    readonly attrArn: string;
    /**
     * The list of endpoints available for interaction with the scheduler.
     *
     * @cloudformationAttribute Endpoints
     */
    readonly attrEndpoints: cdk.IResolvable;
    /**
     * The list of errors that occurred during cluster provisioning.
     *
     * @cloudformationAttribute ErrorInfo
     */
    readonly attrErrorInfo: cdk.IResolvable;
    /**
     * The generated unique ID of the cluster.
     *
     * @cloudformationAttribute Id
     */
    readonly attrId: string;
    /**
     * The provisioning status of the cluster. The provisioning status doesn't indicate the overall health of the cluster.
     *
     * @cloudformationAttribute Status
     */
    readonly attrStatus: string;
    /**
     * Tag Manager which manages the tags for this resource
     */
    readonly cdkTagManager: cdk.TagManager;
    /**
     * The name that identifies the cluster.
     */
    name?: string;
    /**
     * The networking configuration for the cluster's control plane.
     */
    networking: cdk.IResolvable | CfnCluster.NetworkingProperty;
    /**
     * The cluster management and job scheduling software associated with the cluster.
     */
    scheduler: cdk.IResolvable | CfnCluster.SchedulerProperty;
    /**
     * The size of the cluster.
     */
    size: string;
    /**
     * Additional options related to the Slurm scheduler.
     */
    slurmConfiguration?: cdk.IResolvable | CfnCluster.SlurmConfigurationProperty;
    /**
     * 1 or more tags added to the resource.
     */
    tags?: Record<string, string>;
    /**
     * @param scope Scope in which this resource is defined
     * @param id Construct identifier for this resource (unique in its scope)
     * @param props Resource properties
     */
    constructor(scope: constructs.Construct, id: string, props: CfnClusterProps);
    protected get cfnProperties(): Record<string, any>;
    /**
     * Examines the CloudFormation resource and discloses attributes
     *
     * @param inspector tree inspector to collect and process attributes
     */
    inspect(inspector: cdk.TreeInspector): void;
    protected renderProperties(props: Record<string, any>): Record<string, any>;
}
export declare namespace CfnCluster {
    /**
     * TThe networking configuration for the cluster's control plane.
     *
     * @struct
     * @stability external
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pcs-cluster-networking.html
     */
    interface NetworkingProperty {
        /**
         * The list of security group IDs associated with the Elastic Network Interface (ENI) created in subnets.
         *
         * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pcs-cluster-networking.html#cfn-pcs-cluster-networking-securitygroupids
         */
        readonly securityGroupIds?: Array<string>;
        /**
         * The list of subnet IDs where AWS PCS creates an Elastic Network Interface (ENI) to enable communication between managed controllers and AWS PCS resources.
         *
         * The subnet must have an available IP address, cannot reside in AWS Outposts, AWS Wavelength, or an AWS Local Zone. AWS PCS currently supports only 1 subnet in this list.
         *
         * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pcs-cluster-networking.html#cfn-pcs-cluster-networking-subnetids
         */
        readonly subnetIds?: Array<string>;
    }
    /**
     * The cluster management and job scheduling software associated with the cluster.
     *
     * @struct
     * @stability external
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pcs-cluster-scheduler.html
     */
    interface SchedulerProperty {
        /**
         * The software AWS PCS uses to manage cluster scaling and job scheduling.
         *
         * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pcs-cluster-scheduler.html#cfn-pcs-cluster-scheduler-type
         */
        readonly type: string;
        /**
         * The version of the specified scheduling software that AWS PCS uses to manage cluster scaling and job scheduling.
         *
         * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pcs-cluster-scheduler.html#cfn-pcs-cluster-scheduler-version
         */
        readonly version: string;
    }
    /**
     * Additional options related to the Slurm scheduler.
     *
     * @struct
     * @stability external
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pcs-cluster-slurmconfiguration.html
     */
    interface SlurmConfigurationProperty {
        /**
         * The shared Slurm key for authentication, also known as the cluster secret.
         *
         * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pcs-cluster-slurmconfiguration.html#cfn-pcs-cluster-slurmconfiguration-authkey
         */
        readonly authKey?: CfnCluster.AuthKeyProperty | cdk.IResolvable;
        /**
         * The time before an idle node is scaled down.
         *
         * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pcs-cluster-slurmconfiguration.html#cfn-pcs-cluster-slurmconfiguration-scaledownidletimeinseconds
         */
        readonly scaleDownIdleTimeInSeconds?: number;
        /**
         * Additional Slurm-specific configuration that directly maps to Slurm settings.
         *
         * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pcs-cluster-slurmconfiguration.html#cfn-pcs-cluster-slurmconfiguration-slurmcustomsettings
         */
        readonly slurmCustomSettings?: Array<cdk.IResolvable | CfnCluster.SlurmCustomSettingProperty> | cdk.IResolvable;
    }
    /**
     * The shared Slurm key for authentication, also known as the *cluster secret* .
     *
     * @struct
     * @stability external
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pcs-cluster-authkey.html
     */
    interface AuthKeyProperty {
        /**
         * The Amazon Resource Name (ARN) of the shared Slurm key.
         *
         * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pcs-cluster-authkey.html#cfn-pcs-cluster-authkey-secretarn
         */
        readonly secretArn: string;
        /**
         * The version of the shared Slurm key.
         *
         * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pcs-cluster-authkey.html#cfn-pcs-cluster-authkey-secretversion
         */
        readonly secretVersion: string;
    }
    /**
     * Additional settings that directly map to Slurm settings.
     *
     * @struct
     * @stability external
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pcs-cluster-slurmcustomsetting.html
     */
    interface SlurmCustomSettingProperty {
        /**
         * AWS PCS supports configuration of the following Slurm parameters:.
         *
         * - For *clusters*
         *
         * - [`Prolog`](https://docs.aws.amazon.com/https://slurm.schedmd.com/slurm.conf.html#OPT_Prolog_1)
         * - [`Epilog`](https://docs.aws.amazon.com/https://slurm.schedmd.com/slurm.conf.html#OPT_Epilog_1)
         * - [`SelectTypeParameters`](https://docs.aws.amazon.com/https://slurm.schedmd.com/slurm.conf.html#OPT_SelectTypeParameters)
         * - For *compute node groups*
         *
         * - [`Weight`](https://docs.aws.amazon.com/https://slurm.schedmd.com/slurm.conf.html#OPT_Weight)
         * - [`RealMemory`](https://docs.aws.amazon.com/https://slurm.schedmd.com/slurm.conf.html#OPT_Weight)
         *
         * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pcs-cluster-slurmcustomsetting.html#cfn-pcs-cluster-slurmcustomsetting-parametername
         */
        readonly parameterName: string;
        /**
         * The values for the configured Slurm settings.
         *
         * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pcs-cluster-slurmcustomsetting.html#cfn-pcs-cluster-slurmcustomsetting-parametervalue
         */
        readonly parameterValue: string;
    }
    /**
     * An endpoint available for interaction with the scheduler.
     *
     * @struct
     * @stability external
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pcs-cluster-endpoint.html
     */
    interface EndpointProperty {
        /**
         * The endpoint's connection port number.
         *
         * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pcs-cluster-endpoint.html#cfn-pcs-cluster-endpoint-port
         */
        readonly port: string;
        /**
         * The endpoint's private IP address.
         *
         * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pcs-cluster-endpoint.html#cfn-pcs-cluster-endpoint-privateipaddress
         */
        readonly privateIpAddress: string;
        /**
         * The endpoint's public IP address.
         *
         * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pcs-cluster-endpoint.html#cfn-pcs-cluster-endpoint-publicipaddress
         */
        readonly publicIpAddress?: string;
        /**
         * Indicates the type of endpoint running at the specific IP address.
         *
         * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pcs-cluster-endpoint.html#cfn-pcs-cluster-endpoint-type
         */
        readonly type: string;
    }
    /**
     * An error that occurred during resource provisioning.
     *
     * @struct
     * @stability external
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pcs-cluster-errorinfo.html
     */
    interface ErrorInfoProperty {
        /**
         * The short-form error code.
         *
         * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pcs-cluster-errorinfo.html#cfn-pcs-cluster-errorinfo-code
         */
        readonly code?: string;
        /**
         * The detailed error information.
         *
         * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pcs-cluster-errorinfo.html#cfn-pcs-cluster-errorinfo-message
         */
        readonly message?: string;
    }
}
/**
 * Properties for defining a `CfnCluster`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-pcs-cluster.html
 */
export interface CfnClusterProps {
    /**
     * The name that identifies the cluster.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-pcs-cluster.html#cfn-pcs-cluster-name
     */
    readonly name?: string;
    /**
     * The networking configuration for the cluster's control plane.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-pcs-cluster.html#cfn-pcs-cluster-networking
     */
    readonly networking: cdk.IResolvable | CfnCluster.NetworkingProperty;
    /**
     * The cluster management and job scheduling software associated with the cluster.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-pcs-cluster.html#cfn-pcs-cluster-scheduler
     */
    readonly scheduler: cdk.IResolvable | CfnCluster.SchedulerProperty;
    /**
     * The size of the cluster.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-pcs-cluster.html#cfn-pcs-cluster-size
     */
    readonly size: string;
    /**
     * Additional options related to the Slurm scheduler.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-pcs-cluster.html#cfn-pcs-cluster-slurmconfiguration
     */
    readonly slurmConfiguration?: cdk.IResolvable | CfnCluster.SlurmConfigurationProperty;
    /**
     * 1 or more tags added to the resource.
     *
     * Each tag consists of a tag key and tag value. The tag value is optional and can be an empty string.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-pcs-cluster.html#cfn-pcs-cluster-tags
     */
    readonly tags?: Record<string, string>;
}
/**
 * The `AWS::PCS::ComputeNodeGroup` resource creates an AWS PCS compute node group.
 *
 * @cloudformationResource AWS::PCS::ComputeNodeGroup
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-pcs-computenodegroup.html
 */
export declare class CfnComputeNodeGroup extends cdk.CfnResource implements cdk.IInspectable, cdk.ITaggableV2 {
    /**
     * The CloudFormation resource type name for this resource class.
     */
    static readonly CFN_RESOURCE_TYPE_NAME: string;
    /**
     * Build a CfnComputeNodeGroup from CloudFormation properties
     *
     * A factory method that creates a new instance of this class from an object
     * containing the CloudFormation properties of this resource.
     * Used in the @aws-cdk/cloudformation-include module.
     *
     * @internal
     */
    static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnComputeNodeGroup;
    /**
     * The unique Amazon Resource Name (ARN) of the compute node group.
     *
     * @cloudformationAttribute Arn
     */
    readonly attrArn: string;
    /**
     * The list of errors that occurred during compute node group provisioning.
     *
     * @cloudformationAttribute ErrorInfo
     */
    readonly attrErrorInfo: cdk.IResolvable;
    /**
     * The generated unique ID of the compute node group.
     *
     * @cloudformationAttribute Id
     */
    readonly attrId: string;
    /**
     * The provisioning status of the compute node group. The provisioning status doesn't indicate the overall health of the compute node group.
     *
     * @cloudformationAttribute Status
     */
    readonly attrStatus: string;
    /**
     * The ID of the Amazon Machine Image (AMI) that AWS PCS uses to launch instances.
     */
    amiId?: string;
    /**
     * Tag Manager which manages the tags for this resource
     */
    readonly cdkTagManager: cdk.TagManager;
    /**
     * The ID of the cluster of the compute node group.
     */
    clusterId: string;
    /**
     * An Amazon EC2 launch template AWS PCS uses to launch compute nodes.
     */
    customLaunchTemplate: CfnComputeNodeGroup.CustomLaunchTemplateProperty | cdk.IResolvable;
    /**
     * The Amazon Resource Name (ARN) of the IAM instance profile used to pass an IAM role when launching EC2 instances.
     */
    iamInstanceProfileArn: string;
    /**
     * A list of EC2 instance configurations that AWS PCS can provision in the compute node group.
     */
    instanceConfigs: Array<CfnComputeNodeGroup.InstanceConfigProperty | cdk.IResolvable> | cdk.IResolvable;
    /**
     * The name that identifies the compute node group.
     */
    name?: string;
    /**
     * Specifies how EC2 instances are purchased on your behalf.
     */
    purchaseOption?: string;
    /**
     * Specifies the boundaries of the compute node group auto scaling.
     */
    scalingConfiguration: cdk.IResolvable | CfnComputeNodeGroup.ScalingConfigurationProperty;
    /**
     * Additional options related to the Slurm scheduler.
     */
    slurmConfiguration?: cdk.IResolvable | CfnComputeNodeGroup.SlurmConfigurationProperty;
    /**
     * Additional configuration when you specify `SPOT` as the `purchaseOption` .
     */
    spotOptions?: cdk.IResolvable | CfnComputeNodeGroup.SpotOptionsProperty;
    /**
     * The list of subnet IDs where instances are provisioned by the compute node group.
     */
    subnetIds: Array<string>;
    /**
     * 1 or more tags added to the resource.
     */
    tags?: Record<string, string>;
    /**
     * @param scope Scope in which this resource is defined
     * @param id Construct identifier for this resource (unique in its scope)
     * @param props Resource properties
     */
    constructor(scope: constructs.Construct, id: string, props: CfnComputeNodeGroupProps);
    protected get cfnProperties(): Record<string, any>;
    /**
     * Examines the CloudFormation resource and discloses attributes
     *
     * @param inspector tree inspector to collect and process attributes
     */
    inspect(inspector: cdk.TreeInspector): void;
    protected renderProperties(props: Record<string, any>): Record<string, any>;
}
export declare namespace CfnComputeNodeGroup {
    /**
     * An Amazon EC2 launch template AWS PCS uses to launch compute nodes.
     *
     * @struct
     * @stability external
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pcs-computenodegroup-customlaunchtemplate.html
     */
    interface CustomLaunchTemplateProperty {
        /**
         * The ID of the EC2 launch template to use to provision instances.
         *
         * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pcs-computenodegroup-customlaunchtemplate.html#cfn-pcs-computenodegroup-customlaunchtemplate-id
         */
        readonly id: string;
        /**
         * The version of the EC2 launch template to use to provision instances.
         *
         * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pcs-computenodegroup-customlaunchtemplate.html#cfn-pcs-computenodegroup-customlaunchtemplate-version
         */
        readonly version: string;
    }
    /**
     * An EC2 instance configuration AWS PCS uses to launch compute nodes.
     *
     * @struct
     * @stability external
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pcs-computenodegroup-instanceconfig.html
     */
    interface InstanceConfigProperty {
        /**
         * The EC2 instance type that AWS PCS can provision in the compute node group.
         *
         * Example: `t2.xlarge`
         *
         * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pcs-computenodegroup-instanceconfig.html#cfn-pcs-computenodegroup-instanceconfig-instancetype
         */
        readonly instanceType?: string;
    }
    /**
     * Specifies the boundaries of the compute node group auto scaling.
     *
     * @struct
     * @stability external
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pcs-computenodegroup-scalingconfiguration.html
     */
    interface ScalingConfigurationProperty {
        /**
         * The upper bound of the number of instances allowed in the compute fleet.
         *
         * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pcs-computenodegroup-scalingconfiguration.html#cfn-pcs-computenodegroup-scalingconfiguration-maxinstancecount
         */
        readonly maxInstanceCount: number;
        /**
         * The lower bound of the number of instances allowed in the compute fleet.
         *
         * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pcs-computenodegroup-scalingconfiguration.html#cfn-pcs-computenodegroup-scalingconfiguration-mininstancecount
         */
        readonly minInstanceCount: number;
    }
    /**
     * Additional options related to the Slurm scheduler.
     *
     * @struct
     * @stability external
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pcs-computenodegroup-slurmconfiguration.html
     */
    interface SlurmConfigurationProperty {
        /**
         * Additional Slurm-specific configuration that directly maps to Slurm settings.
         *
         * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pcs-computenodegroup-slurmconfiguration.html#cfn-pcs-computenodegroup-slurmconfiguration-slurmcustomsettings
         */
        readonly slurmCustomSettings?: Array<cdk.IResolvable | CfnComputeNodeGroup.SlurmCustomSettingProperty> | cdk.IResolvable;
    }
    /**
     * Additional settings that directly map to Slurm settings.
     *
     * @struct
     * @stability external
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pcs-computenodegroup-slurmcustomsetting.html
     */
    interface SlurmCustomSettingProperty {
        /**
         * AWS PCS supports configuration of the following Slurm parameters:.
         *
         * - For *clusters*
         *
         * - [`Prolog`](https://docs.aws.amazon.com/https://slurm.schedmd.com/slurm.conf.html#OPT_Prolog_1)
         * - [`Epilog`](https://docs.aws.amazon.com/https://slurm.schedmd.com/slurm.conf.html#OPT_Epilog_1)
         * - [`SelectTypeParameters`](https://docs.aws.amazon.com/https://slurm.schedmd.com/slurm.conf.html#OPT_SelectTypeParameters)
         * - For *compute node groups*
         *
         * - [`Weight`](https://docs.aws.amazon.com/https://slurm.schedmd.com/slurm.conf.html#OPT_Weight)
         * - [`RealMemory`](https://docs.aws.amazon.com/https://slurm.schedmd.com/slurm.conf.html#OPT_Weight)
         *
         * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pcs-computenodegroup-slurmcustomsetting.html#cfn-pcs-computenodegroup-slurmcustomsetting-parametername
         */
        readonly parameterName: string;
        /**
         * The values for the configured Slurm settings.
         *
         * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pcs-computenodegroup-slurmcustomsetting.html#cfn-pcs-computenodegroup-slurmcustomsetting-parametervalue
         */
        readonly parameterValue: string;
    }
    /**
     * Additional configuration when you specify `SPOT` as the `purchaseOption` .
     *
     * @struct
     * @stability external
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pcs-computenodegroup-spotoptions.html
     */
    interface SpotOptionsProperty {
        /**
         * The Amazon EC2 allocation strategy AWS PCS uses to provision EC2 instances.
         *
         * AWS PCS supports lowest price, capacity optimized, and price capacity optimized. If you don't provide this option, it defaults to price capacity optimized.
         *
         * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pcs-computenodegroup-spotoptions.html#cfn-pcs-computenodegroup-spotoptions-allocationstrategy
         */
        readonly allocationStrategy?: string;
    }
    /**
     * The list of errors that occurred during compute node group provisioning.
     *
     * @struct
     * @stability external
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pcs-computenodegroup-errorinfo.html
     */
    interface ErrorInfoProperty {
        /**
         * The short-form error code.
         *
         * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pcs-computenodegroup-errorinfo.html#cfn-pcs-computenodegroup-errorinfo-code
         */
        readonly code?: string;
        /**
         * The detailed error information.
         *
         * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pcs-computenodegroup-errorinfo.html#cfn-pcs-computenodegroup-errorinfo-message
         */
        readonly message?: string;
    }
}
/**
 * Properties for defining a `CfnComputeNodeGroup`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-pcs-computenodegroup.html
 */
export interface CfnComputeNodeGroupProps {
    /**
     * The ID of the Amazon Machine Image (AMI) that AWS PCS uses to launch instances.
     *
     * If not provided, AWS PCS uses the AMI ID specified in the custom launch template.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-pcs-computenodegroup.html#cfn-pcs-computenodegroup-amiid
     */
    readonly amiId?: string;
    /**
     * The ID of the cluster of the compute node group.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-pcs-computenodegroup.html#cfn-pcs-computenodegroup-clusterid
     */
    readonly clusterId: string;
    /**
     * An Amazon EC2 launch template AWS PCS uses to launch compute nodes.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-pcs-computenodegroup.html#cfn-pcs-computenodegroup-customlaunchtemplate
     */
    readonly customLaunchTemplate: CfnComputeNodeGroup.CustomLaunchTemplateProperty | cdk.IResolvable;
    /**
     * The Amazon Resource Name (ARN) of the IAM instance profile used to pass an IAM role when launching EC2 instances.
     *
     * The role contained in your instance profile must have pcs:RegisterComputeNodeGroupInstance permissions attached to provision instances correctly.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-pcs-computenodegroup.html#cfn-pcs-computenodegroup-iaminstanceprofilearn
     */
    readonly iamInstanceProfileArn: string;
    /**
     * A list of EC2 instance configurations that AWS PCS can provision in the compute node group.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-pcs-computenodegroup.html#cfn-pcs-computenodegroup-instanceconfigs
     */
    readonly instanceConfigs: Array<CfnComputeNodeGroup.InstanceConfigProperty | cdk.IResolvable> | cdk.IResolvable;
    /**
     * The name that identifies the compute node group.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-pcs-computenodegroup.html#cfn-pcs-computenodegroup-name
     */
    readonly name?: string;
    /**
     * Specifies how EC2 instances are purchased on your behalf.
     *
     * AWS PCS supports On-Demand and Spot instances. For more information, see Instance purchasing options in the Amazon Elastic Compute Cloud User Guide. If you don't provide this option, it defaults to On-Demand.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-pcs-computenodegroup.html#cfn-pcs-computenodegroup-purchaseoption
     */
    readonly purchaseOption?: string;
    /**
     * Specifies the boundaries of the compute node group auto scaling.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-pcs-computenodegroup.html#cfn-pcs-computenodegroup-scalingconfiguration
     */
    readonly scalingConfiguration: cdk.IResolvable | CfnComputeNodeGroup.ScalingConfigurationProperty;
    /**
     * Additional options related to the Slurm scheduler.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-pcs-computenodegroup.html#cfn-pcs-computenodegroup-slurmconfiguration
     */
    readonly slurmConfiguration?: cdk.IResolvable | CfnComputeNodeGroup.SlurmConfigurationProperty;
    /**
     * Additional configuration when you specify `SPOT` as the `purchaseOption` .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-pcs-computenodegroup.html#cfn-pcs-computenodegroup-spotoptions
     */
    readonly spotOptions?: cdk.IResolvable | CfnComputeNodeGroup.SpotOptionsProperty;
    /**
     * The list of subnet IDs where instances are provisioned by the compute node group.
     *
     * The subnets must be in the same VPC as the cluster.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-pcs-computenodegroup.html#cfn-pcs-computenodegroup-subnetids
     */
    readonly subnetIds: Array<string>;
    /**
     * 1 or more tags added to the resource.
     *
     * Each tag consists of a tag key and tag value. The tag value is optional and can be an empty string.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-pcs-computenodegroup.html#cfn-pcs-computenodegroup-tags
     */
    readonly tags?: Record<string, string>;
}
/**
 * The `AWS::PCS::Queue` resource creates an AWS PCS queue.
 *
 * @cloudformationResource AWS::PCS::Queue
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-pcs-queue.html
 */
export declare class CfnQueue extends cdk.CfnResource implements cdk.IInspectable, cdk.ITaggableV2 {
    /**
     * The CloudFormation resource type name for this resource class.
     */
    static readonly CFN_RESOURCE_TYPE_NAME: string;
    /**
     * Build a CfnQueue from CloudFormation properties
     *
     * A factory method that creates a new instance of this class from an object
     * containing the CloudFormation properties of this resource.
     * Used in the @aws-cdk/cloudformation-include module.
     *
     * @internal
     */
    static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnQueue;
    /**
     * The unique Amazon Resource Name (ARN) of the queue.
     *
     * @cloudformationAttribute Arn
     */
    readonly attrArn: string;
    /**
     * The list of errors that occurred during queue provisioning.
     *
     * @cloudformationAttribute ErrorInfo
     */
    readonly attrErrorInfo: cdk.IResolvable;
    /**
     * The generated unique ID of the queue.
     *
     * @cloudformationAttribute Id
     */
    readonly attrId: string;
    /**
     * The provisioning status of the queue. The provisioning status doesn't indicate the overall health of the queue.
     *
     * @cloudformationAttribute Status
     */
    readonly attrStatus: string;
    /**
     * Tag Manager which manages the tags for this resource
     */
    readonly cdkTagManager: cdk.TagManager;
    /**
     * The ID of the cluster of the queue.
     */
    clusterId: string;
    /**
     * The list of compute node group configurations associated with the queue.
     */
    computeNodeGroupConfigurations?: Array<CfnQueue.ComputeNodeGroupConfigurationProperty | cdk.IResolvable> | cdk.IResolvable;
    /**
     * The name that identifies the queue.
     */
    name?: string;
    /**
     * 1 or more tags added to the resource.
     */
    tags?: Record<string, string>;
    /**
     * @param scope Scope in which this resource is defined
     * @param id Construct identifier for this resource (unique in its scope)
     * @param props Resource properties
     */
    constructor(scope: constructs.Construct, id: string, props: CfnQueueProps);
    protected get cfnProperties(): Record<string, any>;
    /**
     * Examines the CloudFormation resource and discloses attributes
     *
     * @param inspector tree inspector to collect and process attributes
     */
    inspect(inspector: cdk.TreeInspector): void;
    protected renderProperties(props: Record<string, any>): Record<string, any>;
}
export declare namespace CfnQueue {
    /**
     * The compute node group configuration for a queue.
     *
     * @struct
     * @stability external
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pcs-queue-computenodegroupconfiguration.html
     */
    interface ComputeNodeGroupConfigurationProperty {
        /**
         * The compute node group ID for the compute node group configuration.
         *
         * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pcs-queue-computenodegroupconfiguration.html#cfn-pcs-queue-computenodegroupconfiguration-computenodegroupid
         */
        readonly computeNodeGroupId?: string;
    }
    /**
     * An error that occurred during resource provisioning.
     *
     * @struct
     * @stability external
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pcs-queue-errorinfo.html
     */
    interface ErrorInfoProperty {
        /**
         * The short-form error code.
         *
         * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pcs-queue-errorinfo.html#cfn-pcs-queue-errorinfo-code
         */
        readonly code?: string;
        /**
         * TBDThe detailed error information.
         *
         * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pcs-queue-errorinfo.html#cfn-pcs-queue-errorinfo-message
         */
        readonly message?: string;
    }
}
/**
 * Properties for defining a `CfnQueue`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-pcs-queue.html
 */
export interface CfnQueueProps {
    /**
     * The ID of the cluster of the queue.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-pcs-queue.html#cfn-pcs-queue-clusterid
     */
    readonly clusterId: string;
    /**
     * The list of compute node group configurations associated with the queue.
     *
     * Queues assign jobs to associated compute node groups.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-pcs-queue.html#cfn-pcs-queue-computenodegroupconfigurations
     */
    readonly computeNodeGroupConfigurations?: Array<CfnQueue.ComputeNodeGroupConfigurationProperty | cdk.IResolvable> | cdk.IResolvable;
    /**
     * The name that identifies the queue.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-pcs-queue.html#cfn-pcs-queue-name
     */
    readonly name?: string;
    /**
     * 1 or more tags added to the resource.
     *
     * Each tag consists of a tag key and tag value. The tag value is optional and can be an empty string.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-pcs-queue.html#cfn-pcs-queue-tags
     */
    readonly tags?: Record<string, string>;
}
