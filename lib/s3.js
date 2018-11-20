var aws = require("aws-sdk");
var path = require("path");
var fs = require("fs");
var mime = require("mime");

var creds = {
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_DEFAULT_REGION || "us-east-1"
};
aws.config.update(creds);

var s3 = new aws.S3();

var upload = function(bucket, path, buffer) {
  return new Promise((ok, fail) => {
    if (typeof buffer == "string") {
      buffer = Buffer.from(buffer);
    }
    var obj = {
      Bucket: bucket,
      Key: path,
      Body: buffer,
      ACL: "public-read",
      ContentType: mime.getType(path),
      CacheControl: "public,max-age=30"
    };
    s3.putObject(obj, function(err) {
      if (err) return fail(err);
      console.log(`Uploaded file to s3://${bucket}/${path}`);
      ok(path);
    })
  });
};

module.exports = { upload };