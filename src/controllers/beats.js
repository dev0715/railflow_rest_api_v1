/**
 * Beats controller.
 * Contains all the business logic executed after
 * hitting any user endpoint in routes.
 */

"use strict";

const { registerBeatsToCryptolens } = require("../services/beats");
/**
 * Function: Register new Beats
 * @param {*} req Request body
 * @param {*} res Response
 * @param {*} next Next
 * @returns Promise
 */
exports.registerBeats = (req, res) => {
  try {
    const { metadata, feature, event, key, value } = req.body;

    if (!metadata) {
      throw new Error("Metadata field is required.");
    }

    if (!feature) {
      throw new Error("Feature field is required.");
    }

    if (!event) {
      throw new Error("Event field is required.");
    }

    if (!key) {
      throw new Error("Key field is required.");
    }

    if (!value) {
      throw new Error("Value field is required.");
    }

    registerBeatsToCryptolens({ metadata, feature, event, key, value });
    return res.status(200).send({
      status: 200,
      data: {
        message: "success",
      },
    });
  } catch (error) {
    const code = error.code ? error.code : 400;
    const message = error.message ? error.message : "server either does not recognize the request.";

    return res.status(code).send({
      status: code,
      data: {
        message,
      },
    });
  }
};
