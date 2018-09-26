const MongoClient = require('mongodb').MongoClient;
const chai = require('chai');
const { expect } = require('chai');
const chaiHttp = require('chai-http');
const server = require('../server');
const mocha = require('mocha');


chai.use(chaiHttp);

before(function (done) {
  MongoClient.connect(process.env.MONGODB_URI, { useNewUrlParser: true }, function (err, db) {
    if (err) throw err;
    db.db('url').collection('urls').deleteMany({}, function (err) {
      if (err) throw err;
      db.db('url').collection('urls').insertMany([
        { _id: "33333", original_url: 'https://google.com' },
        { _id: "55555", original_url: 'http://www.facebook.com' }
      ]).then(() => done());
    })
  })
});


describe('GET link route handler', function () {


  it('redirects to the original url if the short url does exist', function (done) {
    const VALID_SHORT_URL = "55555";

    chai.request(server)
      .get(`/api/shorturl/${VALID_SHORT_URL}`)
      .then(function (res) {
        expect(res).to.have.status(200);
        expect(res.redirects.length).to.be.above(0);
        done()
      })
      .catch(function (err) {
        throw err;
      });
  });


  it('responds with 404 error if the short url does not exist', function (done) {

    chai.request(server)
      .get('/api/shorturl/NOT_A_VALID_SHORT_URL_ID')
      .then(function (res) {
        expect(res).to.have.status(404);
        expect('Content-Type', /json/);
        expect(res.body).to.have.property('error')
        done();
      })
      .catch(function (err) {
        throw err;
      });
  });

});