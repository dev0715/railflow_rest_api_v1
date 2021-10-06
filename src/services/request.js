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
        if (error.response.config) {
          logger.error("Request Data", {
            ...error.response.data,
            ...error.response.config.headers,
            url: `${baseURL}${error.response.config.url}`,
          });
        }
      }
      return error;
    }
  );
  return apiClient;
}

module.exports = {
  getApiClient,
};
