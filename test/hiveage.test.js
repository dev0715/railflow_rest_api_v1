process.env.APP_ENV = "test";

const chai = require("chai");
const expect = chai.expect;
const should = require("should");
const chaiHttp = require("chai-http");
const faker = require("faker");

var server = require("../src/app");

const contactService = require("../src/services/contact");

chai.use(chaiHttp);

describe("Hievage e2e testing", function () {
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
    };
  });

  // remove all added contacts during testing
  this.afterAll(async function () {
    if (addedContactIds.length > 0) await contactService.bulkDelete(addedContactIds);
  });

  it("should create a hievage given valid params ", async function () {
    const createdContactRes = await chai.request(server).post("/api/contact").send(contactData);
    addedContactIds.push(createdContactRes.body.data.contact_id);

    const res = await chai.request(server).post("/api/hiveage").send({
      contact_id: createdContactRes.body.data.contact_id,
      account_id: createdContactRes.body.data.account_id,
      num_users: 20,
      license_type: "professional", // professional or enterprise
      license_years: 2,
    });
    expect(res.body.status).eql(201);
    expect(res.body).to.be.an("object");
    expect(res.body.message).to.eql("Invoice / quote created");
  });

  it("should not create a hievage given invalid license_type ", async function () {
    const createdContactRes = await chai.request(server).post("/api/contact").send(contactData);
    addedContactIds.push(createdContactRes.body.data.contact_id);

    const res = await chai.request(server).post("/api/hiveage").send({
      contact_id: createdContactRes.body.data.contact_id,
      account_id: createdContactRes.body.data.account_id,
      num_users: 20,
      license_type: "license_type_test",
      license_years: 2,
    });
    expect(res.body.status).eql(400);
    expect(res.body.data).to.be.an("object");
    expect(res.body.data.message).to.eql("Incorrect value for license_type");
  });

  it("should not create a hievage given invalid num_users ", async function () {
    const createdContactRes = await chai.request(server).post("/api/contact").send(contactData);
    addedContactIds.push(createdContactRes.body.data.contact_id);

    const res = await chai.request(server).post("/api/hiveage").send({
      contact_id: createdContactRes.body.data.contact_id,
      account_id: createdContactRes.body.data.account_id,
      num_users: 100,
      license_type: "professional",
      license_years: 2,
    });
    expect(res.body.status).eql(400);
    expect(res.body.data).to.be.an("object");
    expect(res.body.data.message).to.eql("Invalid num_users: valid value is: 0-49");
  });

  it("should not create a hievage given invalid contact_id ", async function () {
    const createdContactRes = await chai.request(server).post("/api/contact").send(contactData);
    addedContactIds.push(createdContactRes.body.data.contact_id);

    const res = await chai.request(server).post("/api/hiveage").send({
      contact_id: 1000,
      account_id: createdContactRes.body.data.account_id,
      num_users: 20,
      license_type: "professional",
      license_years: 2,
    });
    expect(res.body.status).eql(404);
    expect(res.body.data).to.be.an("object");
    expect(res.body.data.message).to.eql("Contact does not exist");
    expect(res.body.data.contact_id).eql(1000);
  });

  it("should not create a hievage given invalid account_id ", async function () {
    const createdContactRes = await chai.request(server).post("/api/contact").send(contactData);
    addedContactIds.push(createdContactRes.body.data.contact_id);

    const res = await chai.request(server).post("/api/hiveage").send({
      contact_id: createdContactRes.body.data.contact_id,
      account_id: 10000,
      num_users: 20,
      license_type: "license_type_test",
      license_years: 2,
    });
    console.log(res.body.data.account_id);
    expect(res.body.status).eql(404);
    expect(res.body.data).to.be.an("object");
    expect(res.body.data.message).to.eql("Account does not exist");
    expect(res.body.data.account_id).eql(10000);
  });
});
