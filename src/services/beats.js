const { getApiClient } = require("./request");
const appConfig = require("../../configs/app");
const logger = require("../config/logger");
const configs = appConfig.getConfigs(process.env.APP_ENV);

exports.registerBeatsToCryptolens = async (args) => {
  try {
    const apiClient = await getApiClient(configs.CRYPTOLENS_BASE_URL);
    const response = await apiClient.request({
      method: "POST",
      url: `/api/ai/RegisterEvent?token=${configs.CRYPTOLENS_API_KEY}`,
      headers: {
        "Content-Type": "application/json",
      },
      data: {
        ...args,
        ProductId: configs.PRODUCT_ID,
      },
    });

    logger.info("response", response.data);
    return response;
  } catch (error) {
    logger.error(error);
    throw error;
  }
};
