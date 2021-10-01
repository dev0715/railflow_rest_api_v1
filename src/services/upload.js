"use strict";

const appConfig = require("../../configs/app");
const configs = appConfig.getConfigs(process.env.APP_ENV);
const ApiError = require("../errors/api");
const { machineId } = require("node-machine-id");
const key = require("cryptolens").Key;
const { Storage } = require("@google-cloud/storage");
const Helpers = require("cryptolens").Helpers;
const { v4: uuidv4 } = require("uuid");

// The name of the bucket that you have created
const storage = new Storage({
  keyFilename: "railflow-gcp-prod.json",
  projectId: "railflow-production",
});

/**
 * Service: use Google Cloud to upload images
 * @param {*} data
 * @returns
 */
async function uploadToGoogleCloudStorage(data) {
  try {
    const TOKEN = configs.CRYPTOLENS_LICENSE_EXTENSION_KEY;
    const RSA_PUB_KEY = configs.CRYPTOLENS_RSA_PUB_KEY;

    const PRODUCT_ID = 8245;
    const bucket = storage.bucket(configs.GOOGLE_CLOUD_BUCKET);
    const code = await machineId();
    const licenseKey = await key.Activate(TOKEN, RSA_PUB_KEY, PRODUCT_ID, data.key, code);
    const filename = `${uuidv4()}/railflow_license.skm`;
    const file = bucket.file(filename);
    const fileFullPath = `${configs.GOOGLE_CLOUD_BUCKET_PATH}/${bucket.name}/${filename}`;
    await file.save(Helpers.SaveAsString(licenseKey));

    return { url: fileFullPath };
  } catch (error) {
    console.log(error.response);
    throw new ApiError(`Error while uploading license; ${error}`);
  }
}

async function createBucket(bucketName) {
  try {
    // Creates the new bucket

    const [bucketExists] = await storage.bucket(bucketName).exists();

    if (!bucketExists) {
      await storage.createBucket(bucketName);
      console.log(`Bucket ${bucketName} created.`);
    }
    return true;
  } catch (error) {
    console.log("============", error);
    return false;
  }
}

module.exports = {
  uploadToGoogleCloudStorage,
};
