import * as aws from "@pulumi/aws";
import * as cloudflare from "@pulumi/cloudflare";
import * as pulumi from "@pulumi/pulumi";

const websiteBucket = new aws.s3.BucketV2("websiteBucket", {
    bucket: "afkzoro-hugo-site",
    forceDestroy: false,
    objectLockEnabled: false,
});

const websiteBucketConfiguration = new aws.s3.BucketWebsiteConfigurationV2("websiteBucketConfiguration", {
    bucket: websiteBucket.id,
    indexDocument: {
        suffix: "index.html",
    },
    errorDocument: {
        key: "error.html",
    },
});

const websiteBucketOwnershipControls = new aws.s3.BucketOwnershipControls("websiteBucketOwnershipControls", {
    bucket: websiteBucket.id,
    rule: {
        objectOwnership: "BucketOwnerPreferred",
    },
});
const websiteBucketPublicAccessBlock = new aws.s3.BucketPublicAccessBlock("website", {
    bucket: websiteBucket.id,
    blockPublicAcls: false,
    blockPublicPolicy: false,
    ignorePublicAcls: false,
    restrictPublicBuckets: false,
});

const websiteBucketAclV2 = new aws.s3.BucketAclV2("website", {
    bucket: websiteBucket.id,
    acl: "public-read",
}, {
    dependsOn: [
        websiteBucketOwnershipControls,
        websiteBucketPublicAccessBlock
    ],
});

const bucketPolicy = new aws.s3.BucketPolicy("bucketPolicy", {
    bucket: websiteBucket.id,
    policy: websiteBucket.id.apply(id => JSON.stringify({
        Version: "2012-10-17",
        Statement: [{
            Effect: "Allow",
            Principal: "*",
            Action: [
                "s3:GetObject"
            ],
            Resource: [
                `arn:aws:s3:::${id}/*`
            ]
        }]
    }))
});

const domain = "afkprojects.online";
const zoneId = "01e4285a6fee1d0469c4536734cf93f5";

const cloudflareRecord = new cloudflare.Record("cloudflareRecord", {
    zoneId,
    name: domain,
    type: "CNAME",
    value: websiteBucketConfiguration.websiteEndpoint.apply(endpoint => endpoint),
});

export const bucketWebsiteUrl = websiteBucketConfiguration.websiteEndpoint;
export const cloudflareDomain = cloudflareRecord.name;
