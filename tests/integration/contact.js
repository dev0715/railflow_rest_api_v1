'use strict';

const supertest = require('supertest');
const chai = require('chai');
const expect = chai.expect;
const should = require('should');
const chaiHttp = require('chai-http');

var server = supertest.agent('http://localhost:9000');

//request  = require('supertest')(server);

chai.use(chaiHttp);
describe("POST/PATCH Contact /contact Chai Test", function () {
    it("POST TEST", done => {

        let data = {
            firstName: "ali",
            lastName: "raza",
            email: "careerssss@pessrfmete22r.io",
            phone: "54842222421125",
            jobTitle: "manager",
            company: "C22xsssssssx3",
        };
        server
            .post('/api/contact')         
            .send(data)
            .end((err, res) => {
                console.log('Response Status = ' + res.body.status);
                expect(res.body.status).eql(201);
                expect(res.body).to.be.an('object');
                done();
        });


    });
    it("PATCH TEST", done => {       
        let data = {
            contact_id: "16012716302"
        };
        server
        .patch('/api/contact')
        .send(data)
        .end((err, res) => {  
            console.log('Response Status = ' + res.body.status);
            expect(res.body.status).eql(200);
            expect(res.body).to.be.an('object');
            done();
        })
    });      
});



