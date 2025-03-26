import * as aws from "@pulumi/aws";

export function createS3Bucket(env: string) {
  const siteBucket = new aws.s3.Bucket(`hugo-site-${env}`, {
    bucket: `hugo-site-${env}`,
    website: {
      indexDocument: "index.html",
      errorDocument: "404.html"
    },
    acl: "public-read"
  });

  // Bucket policy for public access
  const bucketPolicy = new aws.s3.BucketPolicy(`hugo-site-policy-${env}`, {
    bucket: siteBucket.id,
    policy: siteBucket.arn.apply(bucketArn => JSON.stringify({
      Version: "2012-10-17",
      Statement: [{
        Sid: "PublicReadGetObject",
        Effect: "Allow",
        Principal: "*",
        Action: ["s3:GetObject"],
        Resource: [`${bucketArn}/*`]
      }]
    }))
  });

  return siteBucket;
}