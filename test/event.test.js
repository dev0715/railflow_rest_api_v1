process.env.APP_ENV = "test";

const chai = require("chai");
const expect = chai.expect;
const should = require("should");
const chaiHttp = require("chai-http");
const faker = require("faker");
const sinon = require("sinon");

var server = require("../src/app");

const contactService = require("../src/services/contact");

chai.use(chaiHttp);

sinon.stub(slackService);

describe("Event e2e testing", function () {
  let contactData = {};
  const addedContactIds = [];

  this.beforeEach(function () {
    contactData = {
      firstName: faker.name.firstName(),
      lastName: faker.name.lastName(),
      email:
        "test_" +
        faker.internet.email(faker.name.firstName(), faker.name.lastName(), "mailinator.com"),
      phone: faker.phone.phoneNumber(),
      jobTitle: "test_" + faker.name.jobTitle(),
      company: "test_" + faker.company.companySuffix() + faker.company.companyName(0),
      cf_test_data: "1",
    };
  });

  // remove all added contacts during testing
  this.afterAll(async function () {
    if (addedContactIds.length > 0) await contactService.bulkDelete(addedContactIds);
  });

  it("should create event and return 200 ", async function () {
    const createdContactRes = await chai.request(server).post("/api/contact").send(contactData);
    addedContactIds.push(createdContactRes.body.data.contact_id);

    const addedEventRes = await chai
      .request(server)
      .post("/api/event")
      .send({
        "event-data": {
          "user-variables": {
            contactId: createdContactRes.body.data.contact_id,
          },
          event: "eventTest",
        },
        signature: {
          timestamp: new Date(),
        },
      });

    expect(addedEventRes.body.status).eql(200);
  });

  it("should not create event and return status 400 contactId not sent ", async function () {
    const createdContactRes = await chai.request(server).post("/api/contact").send(contactData);
    addedContactIds.push(createdContactRes.body.data.contact_id);

    const addedEventRes = await chai
      .request(server)
      .post("/api/event")
      .send({
        "event-data": {
          "user-variables": {
            // contactId: createdContactRes.body.data.contact_id,
          },
          event: "eventTest",
        },
        signature: {
          timestamp: new Date(),
        },
      });

    expect(addedEventRes.body.status).eql(400);
  });

  it("should not create event and return status 400 event not sent", async function () {
    const createdContactRes = await chai.request(server).post("/api/contact").send(contactData);
    addedContactIds.push(createdContactRes.body.data.contact_id);

    const addedEventRes = await chai
      .request(server)
      .post("/api/event")
      .send({
        "event-data": {
          "user-variables": {
            contactId: createdContactRes.body.data.contact_id,
          },
          //   event: "eventTest",
        },
        signature: {
          timestamp: new Date(),
        },
      });

    expect(addedEventRes.body.status).eql(400);
  });

  it("should not create event and return status 400 timestamp not sent", async function () {
    const createdContactRes = await chai.request(server).post("/api/contact").send(contactData);
    addedContactIds.push(createdContactRes.body.data.contact_id);

    const addedEventRes = await chai
      .request(server)
      .post("/api/event")
      .send({
        "event-data": {
          "user-variables": {
            contactId: createdContactRes.body.data.contact_id,
          },
          event: "eventTest",
        },
        signature: {
          //   timestamp: new Date(),
        },
      });

    expect(addedEventRes.body.status).eql(400);
  });
});
