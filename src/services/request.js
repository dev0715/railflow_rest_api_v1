const axios = require("axios");

const logger = require("../config/logger");

/**
 * Init an axios client
 * @param {*} baseURL API Url that you want to call
 * @returns Initialized Axios
 */
async function getApiClient(baseURL) {
  const apiClient = axios.create({
    baseURL,
    headers: {
      "Content-Type": "application/json",
    },
    withCredentials: true,
  });

  apiClient.interceptors.response.use(
    (response) => response,

    (error) => {
      if (error.response) {
        logger.error("Axios error data", error.response.data);
        if (error.response.config) {
          logger.error("Request URL", { url: `${baseURL}${error.response.config.url}` });
          logger.error("Request Headers", error.response.config.headers);
          if (error.response.config.data) logger.error("Request Data", error.response.config.data);
        }
      }
    }
  );
  return apiClient;
}

module.exports = {
  getApiClient,
};
