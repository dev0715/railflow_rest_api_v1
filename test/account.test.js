const chai = require("chai");
const expect = chai.expect;
const should = require("should");
const chaiHttp = require("chai-http");
const faker = require("faker");

var server = require("../src/app");

const contactService = require("../src/services/contact");

chai.use(chaiHttp);

describe("Account e2e Testing", function () {
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

  it("should update account succesfully create new network ", async function () {
    const createdContactRes = await chai.request(server).post("/api/contact").send(contactData);
    if (createdContactRes.body.data.contact_id)
      addedContactIds.push(createdContactRes.body.data.contact_id);

    const res = await chai
      .request(server)
      .put("/api/account")
      .send({
        account_id: createdContactRes.body.data.account_id,
        name: faker.name.findName(),
        first_name: faker.name.firstName(),
        last_name: faker.name.lastName(),
        address: faker.address.streetAddress(),
        city: faker.address.cityName(),
        state_name: faker.address.state(),
        zip_code: faker.address.zipCode(),
        country: faker.address.cityName(),
        business_email: faker.internet.email(
          faker.name.firstName(),
          faker.name.lastName(),
          "mailinator.com"
        ),
        primary_contact_first_name: faker.name.findName(),
        primary_contact_last_name: faker.name.findName(),
      });
    expect(res.body.status).eql(201);
    expect(res.body.data).to.be.an("object");
    expect(res.body.data).have.property("hiveage");
    expect(res.body.data.hiveage).to.be.an("object");
    expect(res.body.data.hiveage).have.property("hash_key");
    expect(res.body.data.hiveage).have.property("id");
    expect(res.body.data.message).eql("updated account");
    expect(res.body.data.account_id).eql(createdContactRes.body.data.account_id);
  });

  it("should should not update account since contact_id is wrong but returns 200 ", async function () {
    const res = await chai
      .request(server)
      .put("/api/account")
      .send({
        account_id: 1000,
        name: faker.name.findName(),
        first_name: faker.name.firstName(),
        last_name: faker.name.lastName(),
        address: faker.address.streetAddress(),
        city: faker.address.cityName(),
        state_name: faker.address.state(),
        zip_code: faker.address.zipCode(),
        country: faker.address.cityName(),
        business_email: faker.internet.email(
          faker.name.firstName(),
          faker.name.lastName(),
          "mailinator.com"
        ),
        primary_contact_first_name: faker.name.findName(),
        primary_contact_last_name: faker.name.findName(),
      });
    expect(res.body.status).eql(200);
    expect(res.body.data).to.be.an("object");
    expect(res.body.data.message).eql("account not found");
    expect(res.body.data.account_id).eql(1000);
  });
});
