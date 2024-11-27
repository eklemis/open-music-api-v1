const config = require("../../utils/config.js");
const {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
} = require("@aws-sdk/client-s3");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");

class StorageService {
  constructor() {
    this._S3 = new S3Client({
      region: config.aws.region,
      credentials: {
        accessKeyId: config.aws.accessKeyId,
        secretAccessKey: config.aws.secretAccessKey,
      },
    });
  }
  createPreSignedUrl({ bucket, key }) {
    const command = new GetObjectCommand({ Bucket: bucket, Key: key });
    return getSignedUrl(this._S3, command, { expiresIn: 3600 });
  }
  async writeFile(file, meta) {
    const parameter = new PutObjectCommand({
      Bucket: config.aws.bucketName,
      Key: meta.filename,
      Body: file._data,
      ContentType: meta.headers["content-type"],
    });
    await this._S3.send(parameter);
    return this.createPreSignedUrl({
      bucket: config.aws.bucketName,
      key: meta.filename,
    });
  }
}
module.exports = StorageService;
