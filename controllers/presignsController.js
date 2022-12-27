const AWS = require("aws-sdk");
const crypto = require("crypto");

const generate = (req, res) => {
  console.log(req.query.filename);
  console.log(req.query.filetype);
  AWS.config.update({
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  });

  const S3_BUCKET = process.env.S3_BUCKET;
  const REGION = process.env.REGION;
  const URL_EXPIRATION_TIME = parseInt(process.env.URL_EXPIRATION_TIME);

  const myBucket = new AWS.S3({
    params: { Bucket: S3_BUCKET },
    region: REGION,
  });

  myBucket.getSignedUrl(
    "putObject",
    {
      Key: "readable/" + crypto.randomUUID() + "/" + req.query.filename,
      ContentType: req.query.filetype,
      Expires: URL_EXPIRATION_TIME,
    },
    (err, url) => {
      res.json(url);
    }
  );
};

module.exports = {
  generate,
};
