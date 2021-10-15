"use strict";
process.env.APP_ENV = "test";

const chai = require("chai");
const expect = chai.expect;
const should = require("should");
const chaiHttp = require("chai-http");
const faker = require("faker");

var server = require("../src/app");

chai.use(chaiHttp);
chai.use(require("chai-as-promised"));

describe("Contact e2e testing", function () {
  this.beforeEach(function () {});

  this.afterEach(function () {});

  it("should create beat", async function () {
    const res = await chai.request(server).post("/api/beats").send({
      key: "HTBEC-AWDLF-GXUVR-RFWSO",
      feature: faker.name.firstName(),
      event: faker.name.firstName(),
      value: faker.datatype.number(),
      metadata: faker.datatype.string(),
    });

    expect(res.body.status).to.equal(200);
    expect(res.body.data).to.be.an("object");
    expect(res.body.data.message).to.equal("success");
  });

  it("should not create beat, Feature field is required", async function () {
    expect(
      chai.request(server).post("/api/beats").send({
        key: "HTBEC-AWDLF-GXUVR-RFWSO",
        //   feature: faker.name.firstName(),
        event: faker.name.firstName(),
        value: faker.datatype.number(),
        metadata: faker.datatype.string(),
      })
    ).to.be.rejectedWith(Error);
  });

  it("should not create beat, Event field is required", async function () {
    expect(
      chai.request(server).post("/api/beats").send({
        key: "HTBEC-AWDLF-GXUVR-RFWSO",
        feature: faker.name.firstName(),
        //   event: faker.name.firstName(),
        value: faker.datatype.number(),
        metadata: faker.datatype.string(),
      })
    ).to.be.rejectedWith(Error);
  });

  it("should not create beat, Event field is required", async function () {
    expect(
      chai.request(server).post("/api/beats").send({
        //   key: "HTBEC-AWDLF-GXUVR-RFWSO",
        feature: faker.name.firstName(),
        event: faker.name.firstName(),
        value: faker.datatype.number(),
        metadata: faker.datatype.string(),
      })
    ).to.be.rejectedWith(Error);
  });
});
