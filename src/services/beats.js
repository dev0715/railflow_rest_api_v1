const { getApiClient } = require("./request");
const appConfig = require("../../configs/app");
const logger = require("../config/logger");
const configs = appConfig.getConfigs();

exports.registerBeatsToCryptolens = async (args) => {
  try {
    const { metadata, feature, event, key, value } = args;
    const apiClient = await getApiClient(configs.CRYPTOLENS_BASE_URL);
    const response = await apiClient.request({
      method: "POST",
      url: `/api/ai/RegisterEvent?token=${configs.CRYPTOLENS_API_KEY}`,
      headers: {
        "Content-Type": "application/json",
      },
      data: {
        ProductId: configs.PRODUCT_ID,
        Key: key,
        FeatureName: feature,
        EventName: event,
        Value: value,
        Metadata: metadata,
      },
    });

    logger.info("response", response.data);
    return response;
  } catch (error) {
    logger.error(error);
    throw error;
  }
};
