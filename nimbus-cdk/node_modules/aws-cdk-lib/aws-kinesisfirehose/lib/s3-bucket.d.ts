import { Construct } from 'constructs';
import { CommonDestinationProps, CommonDestinationS3Props } from './common';
import { DestinationBindOptions, DestinationConfig, IDestination } from './destination';
import * as s3 from '../../aws-s3';
/**
 * Props for defining an S3 destination of a Kinesis Data Firehose delivery stream.
 */
export interface S3BucketProps extends CommonDestinationS3Props, CommonDestinationProps {
}
/**
 * An S3 bucket destination for data from a Kinesis Data Firehose delivery stream.
 */
export declare class S3Bucket implements IDestination {
    private readonly bucket;
    private readonly props;
    constructor(bucket: s3.IBucket, props?: S3BucketProps);
    bind(scope: Construct, _options: DestinationBindOptions): DestinationConfig;
    private getS3BackupMode;
}
