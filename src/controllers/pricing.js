/**
 * User controller.
 * Contains all the business logic executed after
 * hitting any user endpoint in routes.
 */

"use strict";
const { checkToken } = require("../services/token");
var pricing = require("../config/pricing.json");

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
    if (typeof(request.query.license_type) === "undefined" || typeof(request.query.license_years) === "undefined" || typeof(request.query.num_users) === "undefined") {
        return res.status(200).send({
            message: "Only base price",
            pricing: {
                enterprise : {
                    base: pricing.enterprise.base,
                },
                professional : {
                    base : pricing.standard.base
                }
            },
        });
    }

    if (isNaN(request.query.num_users) || request.query.num_users < 0 || request.query.num_users > 49) {
        return res.status(400).send({
            status: 400,
            data: {
                message: 'Invalid num_users: valid value is: 0-49'
            }
        });
    }

    if (isNaN(request.query.license_years) || request.query.license_years < 0 || request.query.license_years > 3) {
        return res.status(400).send({
            status: 400,
            data: {
                message: 'Invalid License_years: valid values are 0-3'
            }
        });
    }
    let resData = {};
    let price_option = 0
    let discount_amt = 0;
    if (request.query.num_users != null) {
        price_option = request.query.num_users >> 0;
    } 
    switch (request.query.license_type.toLowerCase()) {
        case "standard":
            resData.base = pricing.standard.base;
            resData.increment = pricing.standard.increment;
            resData.users = `${20*price_option}-${20*(price_option+1)}`;
            resData.num_users = request.query.num_users;
            resData.base_price = pricing.standard.base + (pricing.standard.increment * price_option);
            resData.years = request.query.license_years;
            if (request.query.license_years == 0) {
                resData.total_price = resData.base_price * 4;
                resData.discount_rate = pricing.standard.discount_perpetual;
            } else {
                resData.total_price = resData.base_price * request.query.license_years;
                resData.discount_rate = pricing.standard[`discount_${request.query.license_years}_year`];
            }
            if (resData.discount_rate) {
                discount_amt = resData.total_price * resData.discount_rate;
                resData.discount_amt = Math.round(discount_amt*100)/100;
            }
            resData.final_price = resData.total_price - Math.round(discount_amt*100)/100;
            return res.status(200).send({
                status: 200,
                standard: resData
            });
        case "enterprise":
            resData.base = pricing.enterprise.base;
            resData.increment = pricing.enterprise.increment;
            resData.users = `${20*price_option}-${20*(price_option+1)}`;
            resData.num_users = parseInt(request.query.num_users);
            resData.base_price = pricing.enterprise.base + (pricing.enterprise.increment * price_option);
            resData.years = parseInt(request.query.license_years);
            if (request.query.license_years == 0) {
                resData.total_price = resData.base_price * 4;
                resData.discount_rate = pricing.enterprise.discount_perpetual;
            } else {
                resData.total_price = resData.base_price * request.query.license_years;
                resData.discount_rate = pricing.enterprise[`discount_${request.query.license_years}_year`];
            }
            if (resData.discount_rate) {
                discount_amt = resData.total_price * resData.discount_rate;
                resData.discount_amt = Math.round(discount_amt*100)/100;
            }
            resData.final_price = resData.total_price - Math.round(discount_amt*100)/100;
            return res.status(200).send({
                enterprise: resData
            });
        default:
            return res.status(400).send({
                data: {
                    message: "Incorrect value for license_type"
                }
            });
    }
}

module.exports = {
    getPricing,
};
