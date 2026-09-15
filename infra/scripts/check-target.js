#!/usr/bin/env node

const { execFileSync } = require("node:child_process");

const EXPECTED_ACCOUNT_ALIAS = "dhines-ccp";
const EXPECTED_REGION = "us-east-1";
const profile = process.env.AWS_PROFILE;
const profileArgs = profile ? ["--profile", profile] : [];

const aws = (args) =>
  execFileSync("aws", [...args, ...profileArgs], {
    encoding: "utf8",
    stdio: ["ignore", "pipe", "inherit"],
  }).trim();

const aliases = JSON.parse(aws(["iam", "list-account-aliases", "--output", "json"])).AccountAliases;
const region = process.env.AWS_REGION || process.env.AWS_DEFAULT_REGION || aws(["configure", "get", "region"]);

if (aliases.length !== 1 || aliases[0] !== EXPECTED_ACCOUNT_ALIAS) {
  throw new Error(`Refusing deployment: expected AWS account alias ${EXPECTED_ACCOUNT_ALIAS}`);
}
if (region !== EXPECTED_REGION) {
  throw new Error(`Refusing deployment: expected AWS region ${EXPECTED_REGION}, found ${region || "none"}`);
}

console.log(`AWS target verified: alias ${EXPECTED_ACCOUNT_ALIAS}, region ${EXPECTED_REGION}`);
