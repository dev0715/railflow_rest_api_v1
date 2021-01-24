'use strict';

const appConfig = require('../../configs/app');
const configs = appConfig.getConfigs(process.env.APP_ENV);

const ApiError = require("../errors/api");
const mailgun = require("mailgun-js");

async function sendEmail(to, text, extraInfo = {}) {
    console.log(`> sendExtensionEmail: ${JSON.stringify(extraInfo)}`);
    const DOMAIN = 'mail.railflow.io';
    const mg = mailgun({ apiKey: configs.MAILGUN_KEY, domain: DOMAIN });
    const data = {
        from: 'Railflow Support <mail@railflow.io>',
        // to: content.body.contact_email,
        to,
        subject: 'Railflow: Your license key is here.',
        text: text,
        ...extraInfo
    };

    try {
        const body = await mg.messages().send(data);
        console.log(`> email queued successfully`);
        return {
            id: body.id,
            // key: content.cryptolensTokenObject.key
        }
    } catch (error) {
        console.log(`> err:sendEmail: ${error}`);
        throw new ApiError(`Error while sending onboarding email.`);
    }
}

module.exports = {
    sendEmail
};