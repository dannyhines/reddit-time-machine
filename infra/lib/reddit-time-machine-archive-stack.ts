import {
  ArnFormat,
  CfnOutput,
  RemovalPolicy,
  Stack,
  StackProps,
  Tags,
  aws_cloudfront as cloudfront,
  aws_cloudfront_origins as origins,
  aws_pricingplanmanager as pricingplanmanager,
  aws_s3 as s3,
  aws_wafv2 as wafv2,
} from "aws-cdk-lib";
import { Construct } from "constructs";

export const ARCHIVE_BUCKET_NAME = "reddit-time-machine-archive-prod-20260914";
export const ARCHIVE_DISTRIBUTION_COMMENT = "reddit-time-machine-archive-prod";
export const ARCHIVE_OAC_NAME = "reddit-time-machine-archive-prod-oac";
export const ARCHIVE_WEB_ACL_NAME = "reddit-time-machine-archive-prod-web-acl";

export class RedditTimeMachineArchiveStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const bucket = new s3.Bucket(this, "ArchiveBucket", {
      bucketName: ARCHIVE_BUCKET_NAME,
      blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
      encryption: s3.BucketEncryption.S3_MANAGED,
      enforceSSL: true,
      objectOwnership: s3.ObjectOwnership.BUCKET_OWNER_ENFORCED,
      removalPolicy: RemovalPolicy.RETAIN,
      versioned: false,
    });

    const webAcl = new wafv2.CfnWebACL(this, "ArchiveWebAcl", {
      name: ARCHIVE_WEB_ACL_NAME,
      description: "Required dedicated WAF protection pack for the Reddit Time Machine CloudFront Free plan",
      scope: "CLOUDFRONT",
      defaultAction: { allow: {} },
      visibilityConfig: {
        cloudWatchMetricsEnabled: false,
        metricName: "redditTimeMachineArchive",
        sampledRequestsEnabled: false,
      },
    });

    const originAccessControl = new cloudfront.S3OriginAccessControl(this, "ArchiveOriginAccessControl", {
      originAccessControlName: ARCHIVE_OAC_NAME,
      description: "Read-only signed access to the Reddit Time Machine archive bucket",
      signing: cloudfront.Signing.SIGV4_ALWAYS,
    });

    const archiveOrigin = origins.S3BucketOrigin.withOriginAccessControl(bucket, {
      originAccessControl,
      originAccessLevels: [cloudfront.AccessLevel.READ],
    });

    const distribution = new cloudfront.Distribution(this, "ArchiveDistribution", {
      comment: ARCHIVE_DISTRIBUTION_COMMENT,
      defaultBehavior: {
        origin: archiveOrigin,
        allowedMethods: cloudfront.AllowedMethods.ALLOW_GET_HEAD,
        cachedMethods: cloudfront.CachedMethods.CACHE_GET_HEAD,
        cachePolicy: cloudfront.CachePolicy.CACHING_OPTIMIZED,
        compress: false,
        viewerProtocolPolicy: cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
      },
      enabled: true,
      httpVersion: cloudfront.HttpVersion.HTTP2_AND_3,
      webAclId: webAcl.attrArn,
    });

    const distributionArn = this.formatArn({
      service: "cloudfront",
      region: "",
      resource: "distribution",
      resourceName: distribution.distributionId,
      arnFormat: ArnFormat.SLASH_RESOURCE_NAME,
    });

    const subscription = new pricingplanmanager.CfnSubscription(this, "ArchiveFreePlan", {
      planFamily: "CloudFront",
      planTier: "FREE",
      usageLevel: "DEFAULT",
      resourceArns: [distributionArn, webAcl.attrArn],
    });
    subscription.addResourceDependency(webAcl);
    subscription.addResourceDependency(distribution.node.defaultChild as cloudfront.CfnDistribution);

    Tags.of(this).add("Application", "reddit-time-machine");
    Tags.of(this).add("Environment", "production");
    Tags.of(this).add("ManagedBy", "aws-cdk");

    new CfnOutput(this, "ArchiveBucketName", { value: bucket.bucketName });
    new CfnOutput(this, "ArchiveDistributionId", { value: distribution.distributionId });
    new CfnOutput(this, "ArchiveBaseUrl", { value: `https://${distribution.distributionDomainName}` });
    new CfnOutput(this, "ArchivePricingPlanArn", { value: subscription.attrArn });
  }
}
