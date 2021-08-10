/**
 * User controller.
 * Contains all the business logic executed after
 * hitting any user endpoint in routes.
 */

"use strict";
const { checkToken } = require("../services/token");
const pricing = require("../config/pricing.json");
const users = require("../config/users.json");

/**
 * Function: Get Pricing List
 * @param {*} request Request body
 * @param {*} res Response
 * @param {*} next Next
 * @returns Promise
 */
async function getPricing(request, res, next) {
    // Middleware: Check token beforehand
    const isAuthenticated = await checkToken(request.headers.token);
    if (!isAuthenticated) {
        return res.status(400).send({
            status: 400,
            message: "token invalid or missing",
        });
    }
    if (typeof(request.query.license_type) === "undefined") {
        let tiers = [];
        for (let index = 0; index < users.list_size; index++) {
            tiers.push(`${index * users.increment} - ${(index + 1) * users.increment}`);
        }
        let resPrices = {};
        for (const [key, value] of Object.entries(pricing)) {
            resPrices[key] = {
                base: value.base
            };
          }
        return res.status(200).send({
            message: "Only base price",
            users:{
                tiers: tiers
            },
            pricing: resPrices,
        });
    }

    let resData = {};
    let price_options = [];
    let discount_amt = 0;
    for (let index = 0; index < users.list_size; index++) {
        price_options.push(index >> 0)
    }
    const pricingType = pricing[request.query.license_type];
    if (pricingType == undefined || pricingType == null) {
        return res.status(400).send({
            data: {
                message: "Incorrect value for license_type"
            }
        });
    }
    for (let index = 0; index <= pricingType.years; index++) {
        resData.license_type = request.query.license_type;
        resData.base = pricingType.base;
        resData.increment = pricingType.increment;
        let licenseName = `${index} Year License`;
        let licenseYear = index;
        if (index == 0) {
            licenseName = `Perpetual License`;
            licenseYear = 4;
            resData[licenseName] = {};
            resData[licenseName].discount_rate = pricingType.discount_perpetual;
        } else {
            resData[licenseName] = {};
            resData[licenseName].discount_rate = pricingType[`discount_${index}_year`];
        }
        resData[licenseName].tiers = [];
        price_options.forEach(price_option => {
            let tier = {};
            tier.users = `${20*price_option}-${20*(price_option+1)}`;
            tier.yearly_price = pricingType.base + (pricingType.increment * price_option);
            tier.undiscount_price = tier.yearly_price * licenseYear;
            discount_amt = tier.undiscount_price * resData[licenseName].discount_rate;
            tier.discount = Math.round(discount_amt*100)/100;
            tier.final_price = tier.undiscount_price - tier.discount;
            resData[licenseName].tiers.push(tier);
        });
    }
    return res.status(200).send({
        message: "Pricing detail",
        pricing:resData
    });
}

module.exports = {
    getPricing,
};
