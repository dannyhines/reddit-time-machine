import assert from "node:assert/strict";
import test from "node:test";
import { App } from "aws-cdk-lib";
import { Match, Template } from "aws-cdk-lib/assertions";
import {
  ARCHIVE_BUCKET_NAME,
  ARCHIVE_DISTRIBUTION_COMMENT,
  ARCHIVE_OAC_NAME,
  ARCHIVE_WEB_ACL_NAME,
  RedditTimeMachineArchiveStack,
} from "../lib/reddit-time-machine-archive-stack";

const getTemplate = () => {
  const app = new App();
  const stack = new RedditTimeMachineArchiveStack(app, "TestStack", {
    env: { account: "111111111111", region: "us-east-1" },
  });
  return Template.fromStack(stack);
};

test("creates a private retained S3 archive bucket", () => {
  const template = getTemplate();

  template.hasResourceProperties("AWS::S3::Bucket", {
    BucketName: ARCHIVE_BUCKET_NAME,
    BucketEncryption: {
      ServerSideEncryptionConfiguration: [
        { ServerSideEncryptionByDefault: { SSEAlgorithm: "AES256" } },
      ],
    },
    OwnershipControls: { Rules: [{ ObjectOwnership: "BucketOwnerEnforced" }] },
    PublicAccessBlockConfiguration: {
      BlockPublicAcls: true,
      BlockPublicPolicy: true,
      IgnorePublicAcls: true,
      RestrictPublicBuckets: true,
    },
  });
  template.hasResource("AWS::S3::Bucket", { DeletionPolicy: "Retain", UpdateReplacePolicy: "Retain" });
});

test("serves the bucket through an always-signed OAC and dedicated WAF ACL", () => {
  const template = getTemplate();

  template.hasResourceProperties("AWS::CloudFront::OriginAccessControl", {
    OriginAccessControlConfig: {
      Name: ARCHIVE_OAC_NAME,
      OriginAccessControlOriginType: "s3",
      SigningBehavior: "always",
      SigningProtocol: "sigv4",
    },
  });
  template.hasResourceProperties("AWS::WAFv2::WebACL", {
    Name: ARCHIVE_WEB_ACL_NAME,
    Scope: "CLOUDFRONT",
    DefaultAction: { Allow: {} },
  });
  template.hasResourceProperties("AWS::CloudFront::Distribution", {
    DistributionConfig: Match.objectLike({
      Comment: ARCHIVE_DISTRIBUTION_COMMENT,
      Enabled: true,
      HttpVersion: "http2and3",
      WebACLId: Match.anyValue(),
    }),
  });
});

test("subscribes only the distribution and WAF ACL to the free flat-rate plan", () => {
  const template = getTemplate();

  template.hasResourceProperties("AWS::PricingPlanManager::Subscription", {
    PlanFamily: "CloudFront",
    PlanTier: "FREE",
    UsageLevel: "DEFAULT",
  });
  template.resourceCountIs("AWS::PricingPlanManager::Subscription", 1);
  template.resourceCountIs("AWS::CloudFront::Distribution", 1);
  template.resourceCountIs("AWS::WAFv2::WebACL", 1);
  template.resourceCountIs("AWS::S3::Bucket", 1);

  const resources = template.findResources("AWS::PricingPlanManager::Subscription");
  const subscription = Object.values(resources)[0];
  assert.equal(subscription.Properties.ResourceArns.length, 2);
  assert.match(JSON.stringify(subscription.Properties.ResourceArns[0]), /distribution\//);
  assert.match(JSON.stringify(subscription.Properties.ResourceArns[1]), /ArchiveWebAcl/);
});
