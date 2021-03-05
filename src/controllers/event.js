/**
 * User controller.
 * Contains all the business logic executed after
 * hitting any user endpoint in routes.
 */

"use strict";

const dayjs = require('dayjs');

const BadRequestError = require("../errors/badrequest");
const noteService = require('../services/note');

async function createEvent(req, res, next) {
    try {
        if (!(req.body["event-data"]["user-variables"] && req.body["event-data"]["user-variables"].contactId)) {
            throw new BadRequestError(`Contact id is required to register event`);
        }

        const eventData = req.body["event-data"];
        const event = eventData.event;
        const contactId = eventData["user-variables"].contactId;
        const timestamp = req.body.signature.timestamp * 1000; // converting to mili seconds
        let noteDescription = `Email was: ${event} at ${dayjs(timestamp).format('YYYY-MM-DD HH:mm:ss')}`;
        await noteService.create(contactId, noteDescription)
        return res.status(200).send({
            status: 200,
            data: {
                message: `Event created for contact id: ${contactId}`
            }
        });
    } catch (error) {
        console.log(`> error while creating event for: ${req.body["event-data"]["user-variables"].contactId}: ${error}`);
        return res.status(error.status).send(error.toJSON());
    }
}

module.exports = {
    createEvent,
};
