import * as cloudflare from "@pulumi/cloudflare";
import * as aws from "@pulumi/aws";


export function setupCloudflare(siteBucket: aws.s3.Bucket) {
  const zone = new cloudflare.Zone("hugo-site-zone", {
    zone: "afkprojects.online",
    accountId: "fe4f2bbff3260f4e229e095a60ffb2af"
  });

  const dnsRecord = new cloudflare.Record("hugo-site-dns", {
    zoneId: zone.id,
    name: "www",
    type: "CNAME",
    value: siteBucket.websiteEndpoint,
    proxied: true
  });

  return {
    zone,
    dnsRecord,
    domain: dnsRecord.hostname
  };
}