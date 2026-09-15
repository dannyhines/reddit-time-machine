#!/usr/bin/env node

import { App, LegacyStackSynthesizer } from "aws-cdk-lib";
import { RedditTimeMachineArchiveStack } from "../lib/reddit-time-machine-archive-stack";

const app = new App();

new RedditTimeMachineArchiveStack(app, "RedditTimeMachineArchive", {
  env: {
    account: process.env.CDK_DEFAULT_ACCOUNT,
    region: "us-east-1",
  },
  description: "Private static Reddit archive served through CloudFront",
  // This stack has no CDK assets. Reusing the account's existing legacy
  // bootstrap avoids creating a second asset bucket, ECR repository, and IAM
  // roles solely for this small CloudFormation template.
  synthesizer: new LegacyStackSynthesizer(),
});
