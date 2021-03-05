'use strict';

const appConfig = require('../../configs/app');
const configs = appConfig.getConfigs(process.env.APP_ENV);
const { getApiClient } = require('../services/request');
const ApiError = require("../errors/api");

const dayjs = require('dayjs');

async function create(data) {
    try {
        const afterDays = [5, 10];
        for (let d of afterDays) {
            const apiClient = await getApiClient(configs.FRESHSALES_BASE_URL); // put railflow host
            const response = await apiClient.request({
                method: 'POST',
                url: '/crm/sales/api/tasks',
                headers: {
                    // TODO: use environment variable
                    Authorization: `Token token=${configs.FRESHSALES_API_KEY}`,
                    'Content-Type': 'application/json',
                },
                data: {
                    task: {
                        title: `follow-up-${d}-days: ${data.contact_id}`,
                        description: `${d}-day-follow-up`,
                        due_date: dayjs().add(d, 'days').format('[YYYYescape] YYYY-MM-DDTHH:mm:ssZ[Z]'),
                        owner_id: 16000006416,
                        targetable_id: data.contact_id,
                        targetable_type: "Contact",
                    }
                }
            });
        }

        console.log(`> tasks created successfully for contact id: ${data.contact_id}`);
        return {
            success: true,
            message: `${afterDays.length} Tasks created successfully`
        };
    } catch (error) {
        throw new ApiError(`Error while creating tasks for contact: ${data.contact_id}`);
        return;
    }
}

module.exports = {
    create
};