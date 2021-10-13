process.env.APP_ENV = "test";

const chai = require("chai");
const expect = chai.expect;
const should = require("should");
const chaiHttp = require("chai-http");
const faker = require("faker");
const sinon = require("sinon");

var server = require("../src/app");

const contactService = require("../src/services/contact");
const slackService = require("../src/services/slack");

chai.use(chaiHttp);

describe("Pricing e2e testing", function () {
  let contactData = {};
  const addedContactIds = [];

  this.beforeEach(function () {
    sinon.stub(slackService);
    contactData = {
      firstName: faker.name.firstName(),
      lastName: faker.name.lastName(),
      email:
        "test_" +
        faker.internet.email(faker.name.firstName(), faker.name.lastName(), "mailinator.com"),
      phone: faker.phone.phoneNumber(),
      jobTitle: "test_" + faker.name.jobTitle(),
      company: "test_" + faker.company.companySuffix() + faker.company.companyName(0),
      cf_test_data: 1,
    };
  });

  this.afterEach(function () {
    sinon.restore();
  });

  // remove all added contacts during testing
  this.afterAll(async function () {
    if (addedContactIds.length > 0) await contactService.bulkDelete(addedContactIds);
    sinon.restore();
  });

  // it("should get professional pricing since valid queries", async function () {
  //   const createdContactRes = await chai.request(server).post("/api/contact").send(contactData);

  //   const pricingRes = await chai.request(server).get("/api/pricing").query({
  //     license_type: "professional",
  //     license_years: 2,
  //     account_id: createdContactRes.body.data.account_id,
  //     contact_id: createdContactRes.body.data.contact_id,
  //     num_users: 5,
  //   });

  //   expect(pricingRes.body.status).eql(200);
  //   expect(pricingRes.body.message).eql("Pricing detail");
  //   expect(pricingRes.body.pricing).to.be.an("object");
  //   expect(pricingRes.body.pricing.license_type).eql("professional");
  // });

  // it("should get base price", async function () {
  //   const createdContactRes = await chai.request(server).post("/api/contact").send(contactData);

  //   const pricingRes = await chai.request(server).get("/api/pricing").query({
  //     //   license_type: "professional",
  //     license_years: 2,
  //     account_id: createdContactRes.body.data.account_id,
  //     contact_id: createdContactRes.body.data.contact_id,
  //     num_users: 5,
  //   });

  //   expect(pricingRes.body.status).eql(200);
  //   expect(pricingRes.body.message).eql("Only base price");
  //   expect(pricingRes.body.users).to.be.an("object");
  //   expect(pricingRes.body.pricing).to.be.an("object");
  // });

  // it("should get 400 status, num_users is greater than 49", async function () {
  //   const createdContactRes = await chai.request(server).post("/api/contact").send(contactData);

  //   const pricingRes = await chai.request(server).get("/api/pricing").query({
  //     license_type: "professional",
  //     license_years: 2,
  //     account_id: createdContactRes.body.data.account_id,
  //     contact_id: createdContactRes.body.data.contact_id,
  //     num_users: 50,
  //   });

  //   expect(pricingRes.body.status).eql(400);
  // });

  // it("should get 400 status, license_years is greater than 3 ", async function () {
  //   const createdContactRes = await chai.request(server).post("/api/contact").send(contactData);

  //   const pricingRes = await chai.request(server).get("/api/pricing").query({
  //     license_type: "professional",
  //     license_years: 5,
  //     account_id: createdContactRes.body.data.account_id,
  //     contact_id: createdContactRes.body.data.contact_id,
  //     num_users: 5,
  //   });

  //   expect(pricingRes.body.status).eql(400);
  // });
});
