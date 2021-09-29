"use strict";
process.env.APP_ENV = "test";

// - create contact with unique values
// - create contact with duplicate phone - error
// - create contact with duplicate email - no error - returns record back
// - create contact with duplicate company name - no error - check if contact is actually added to same company. don't create a new company. response should return same account id
// - patch contact (verify contact basically). check if contact's 'License Key' field is not null (means verification was a success)

// const supertest = require("supertest");
const chai = require("chai");
const expect = chai.expect;
const should = require("should");
const chaiHttp = require("chai-http");
const faker = require("faker");

var server = require("../src/app");

const contactService = require("../src/services/contact");

chai.use(chaiHttp);

describe("Contact e2e testing", function () {
  let data = {};
  const addedContactIds = [];

  this.beforeEach(function () {
    data = {
      firstName: "test_" + faker.name.firstName(),
      lastName: "test_" + faker.name.lastName(),
      email:
        "test_" +
        faker.internet.email(faker.name.firstName(), faker.name.lastName(), "mailinator.com"),
      phone: faker.phone.phoneNumber(),
      jobTitle: "test_" + faker.name.jobTitle(),
      company: "test_" + faker.company.companySuffix() + faker.company.companyName(0),
    };
  });

  // remove all added contacts during testing
  this.afterAll(async function () {
    if (addedContactIds.length > 0) await contactService.bulkDelete(addedContactIds);
  });

  it("create contact with unique values", async function () {
    const res = await chai.request(server).post("/api/contact").send(data);

    expect(res.body.status).eql(201);
    expect(res.body).to.be.an("object");
    expect(res.body.data).to.be.an("object");
    expect(res.body.data.message).eq("contact created");

    addedContactIds.push(res.body.data.contact_id);
  });
  // patch test
  it("patch contact and check license_key returns ", async function () {
    const createdContactRes = await chai.request(server).post("/api/contact").send(data);

    const updatedContactRes = await chai
      .request(server)
      .patch("/api/contact")
      .send({ contact_id: createdContactRes.body.data.contact_id });
    expect(updatedContactRes.body.status).eql(200);
    expect(updatedContactRes.body).to.be.an("object");
    expect(updatedContactRes.body.data).to.be.an("object");
    expect(updatedContactRes.body.data.message).eq("contact verified");
    expect(updatedContactRes.body.data.license_key).not.eql(null);

    addedContactIds.push(createdContactRes.body.data.contact_id);
  });

  it("Create contact with duplicate phone - error ", async function () {
    const res = await chai.request(server).post("/api/contact").send(data);

    const duplicatedPhoneRes = await chai
      .request(server)
      .post("/api/contact")
      .send({
        firstName: "test_" + faker.name.firstName(),
        lastName: "test_" + faker.name.lastName(),
        email: faker.internet.email(
          "test_" + faker.name.firstName(),
          faker.name.lastName(),
          "mailinator.com"
        ),
        phone: data.phone,
        jobTitle: "test_" + faker.name.jobTitle(),
        company: "test_" + faker.company.companySuffix() + faker.company.companyName(0),
      });
    expect(duplicatedPhoneRes.body.status).equal(400);
    expect(duplicatedPhoneRes.body).to.be.an("object");
    expect(duplicatedPhoneRes.body.data.message).equal("Duplicate Phone Number");

    addedContactIds.push(res.body.data.contact_id);
  });

  it("create contact with duplicate email - no error - returns record back ", async function () {
    const res = await chai.request(server).post("/api/contact").send(data);
    console.log(res.body);
    const duplicatedPhoneRes = await chai
      .request(server)
      .post("/api/contact")
      .send({
        firstName: faker.name.firstName(),
        lastName: faker.name.lastName(),
        email: data.email,
        phone: faker.phone.phoneNumber(),
        jobTitle: faker.name.jobTitle(),
        company: faker.company.companySuffix() + faker.company.companyName(0),
      });
    console.log(duplicatedPhoneRes.body);

    expect(duplicatedPhoneRes.body.status).equal(201);
    expect(duplicatedPhoneRes.body).to.be.an("object");
    expect(duplicatedPhoneRes.body.data).to.be.an("object");

    addedContactIds.push(res.body.data.contact_id);
  });
});
