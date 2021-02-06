'use strict';

const appConfig = require('../../configs/app');
const configs = appConfig.getConfigs(process.env.APP_ENV);

const ApiError = require("../errors/api");
const mailgun = require("mailgun-js");

async function sendEmail(to, text, extraInfo = {}) {
    console.log(`> sending email to: ${to} | extra_info: ${JSON.stringify(extraInfo)}`);
    const DOMAIN = 'mail.railflow.io';
    const mg = mailgun({ apiKey: configs.MAILGUN_KEY, domain: DOMAIN });
    const data = {
        from: 'Railflow Support <mail@railflow.io>',
        // to: content.body.contact_email,
        to,
        subject: 'Railflow: Your license key is here.',
        html: `<p>${text}</p>`,
        ...extraInfo
    };

    try {
        const body = await mg.messages().send(data);
        console.log(`> email queued successfully to: ${to} | email_id: ${body.id}`);
        return {
            id: body.id,
            // key: content.cryptolensTokenObject.key
        }
    } catch (error) {
        console.log(`> error while sending email: ${error}`);
        throw new ApiError(`Error while sending onboarding email.`);
    }
}

module.exports = {
    sendEmail
};