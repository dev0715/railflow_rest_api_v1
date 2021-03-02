'use strict';

const appConfig = require('../../configs/app');
const configs = appConfig.getConfigs(process.env.APP_ENV);
const ApiError = require("../errors/api");

const fs = require('fs');
const { machineId } = require('node-machine-id');
const key = require('cryptolens').Key;
const Helpers = require('cryptolens').Helpers;
const AWS = require('aws-sdk');
const path = require('path');

const ID = configs.AWS_ACCESS_KEY_ID;
const SECRET = configs.AWS_SECRET_ACCESS_KEY;

// The name of the bucket that you have created
const BUCKET_NAME = 'test-bucket';

const s3 = new AWS.S3({
    accessKeyId: ID,
    secretAccessKey: SECRET
});

async function uploadToS3(data) {
    try {
        const PRODUCT_ID = 8245;
        const TOKEN = configs.CRYPTOLENS_LICENSE_EXTENSION_KEY;
        const RSA_PUB_KEY = configs.CRYPTOLENS_RSA_PUB_KEY;
        const code = await machineId();
        const licenseKey = await key.Activate(TOKEN, RSA_PUB_KEY, PRODUCT_ID, data.key, code);

        const dir = path.join(__dirname, '../../cryptolens');

        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir);
        }

        fs.writeFileSync(path.join(__dirname, `../../cryptolens/${data.customerName}.skm`), Helpers.SaveAsString(licenseKey), { encoding: 'utf-8' });
        const fileContent = fs.readFileSync(path.join(__dirname, `../../cryptolens/${data.customerName}.skm`)).toString();
        // upload to s3

        const params = {
            Key: `${data.customerName}/${data.customerName}_railflow_license.skm`,
            Bucket: "railflow",
            Body: fileContent
        };

        // Uploading files to the bucket
        // const uploadRes = await s3.upload(params);
        // await s3.putObject(params);
        return new Promise((resolve, reject) => {
            s3.putObject(params, function (err, data) {
                if (err) {
                    console.log(err, err.stack);
                    reject(err);
                }
                else {
                    console.log(data);
                    resolve({
                        url: `https://railflow.s3.amazonaws.com/${params.Key}`
                    });
                }
            });
        });
    } catch (error) {
        throw new ApiError(`Error while uploading license; ${error}`);
    }
}

async function readFile(path) {
    return new Promise((resolve, reject) => {
        fs.readFile(path, 'utf8', (err, data) => {
            if (err) reject(err);
            resolve(data.toString());
        })
    });

}

module.exports = {
    uploadToS3
};