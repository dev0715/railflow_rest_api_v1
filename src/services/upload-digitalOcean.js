"use strict";

const appConfig = require("../../configs/app");
const configs = appConfig.getConfigs(process.env.APP_ENV);
const ApiError = require("../errors/api");
const { machineId } = require("node-machine-id");
const key = require("cryptolens").Key;
const Helpers = require("cryptolens").Helpers;
const { v4: uuidv4 } = require("uuid");
const logger = require("../config/logger");

const AWS = require("aws-sdk");

console.log(configs.SPACE_ENDPOINT);
const spacesEndpoint = new AWS.Endpoint(configs.SPACE_ENDPOINT);
const s3 = new AWS.S3({
  endpoint: spacesEndpoint,
  accessKeyId: configs.SPACES_KEY,
  secretAccessKey: configs.SPACES_SECRET,
});

// /**
//  * Service: use Google Cloud to upload images
//  * @param {*} data
//  * @returns
//  */
async function uploadToDigitalOcean(data) {
  try {
    const TOKEN = configs.CRYPTOLENS_LICENSE_EXTENSION_KEY;
    const RSA_PUB_KEY = configs.CRYPTOLENS_RSA_PUB_KEY;

    const PRODUCT_ID = 8245;
    const code = await machineId();
    const licenseKey = await key.Activate(TOKEN, RSA_PUB_KEY, PRODUCT_ID, data.key, code);
    const filename = `${uuidv4()}/railflow_license.skm`;

    const fileFullPath = `${configs.SPACE_NAME}.${configs.SPACE_ENDPOINT}/${filename}`;

    const params = {
      Bucket: configs.SPACE_NAME,
      Key: filename,
      Body: Helpers.SaveAsString(licenseKey),
      ACL: "public-read",
    };
    await s3.putObject(params, function (err, data) {
      if (err) {
        console.log(err, err.stack);
      } else {
        console.log(data);
      }
    });
    console.log(fileFullPath);
    return { url: fileFullPath };
  } catch (error) {
    logger.error("Error When trying to upload file to Digital Ocean", error);
    throw new ApiError(`Error while uploading license; ${error}`);
  }
}

module.exports = { uploadToDigitalOcean };
