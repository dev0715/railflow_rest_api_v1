const { getApiClient } = require("./request");
const appConfig = require("../../configs/app");
const configs = appConfig.getConfigs(process.env.APP_ENV);

exports.registerBeatsToCryptolens = async (args) => {
  try {
    const apiClient = await getApiClient(configs.CRYPTOLENS_REGISTER);
    const response = await apiClient.request({
      method: "POST",
      url: `api/ai/RegisterEvent?token=${configs.CRYPTOLENS_TOKEN}`,
      headers: {
        "Content-Type": "application/json",
      },
      data: {
        ...args,
      },
    });
    return response;
  } catch (error) {
    throw error;
  }
};
