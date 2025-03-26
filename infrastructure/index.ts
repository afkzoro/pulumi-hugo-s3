import * as pulumi from "@pulumi/pulumi";
import * as cloudflare from "@pulumi/cloudflare";

// Import specific infrastructure modules
import { createS3Bucket } from "./s3";
import { setupCloudflare } from "./cloudflare";

// Create infrastructure stack
const config = new pulumi.Config();
const env = config.require("env"); // 'dev' or 'prod'

// S3 Bucket for static hosting
const siteBucket = createS3Bucket(env);

// Cloudflare DNS and CDN
const cloudflareSetup = setupCloudflare(siteBucket);

// Export important outputs
export const bucketName = siteBucket.id;
export const websiteEndpoint = siteBucket.websiteEndpoint;
export const cloudflareDomain = cloudflareSetup.domain;