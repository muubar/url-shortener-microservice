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


describe('POST link route handler', function () {


  it('responds with the original and the new generated short link when a valid url is posted', function (done) {
    const VALID_URL = "https://www.amazon.com";

    chai.request(server)
      .post('/api/shorturl/new')
      .send({ 'url': VALID_URL })
      .then(function (res) {
        expect(res).to.have.status(200);
        expect('Content-Type', /json/);
        expect(typeof res.body.short_url).equals('string');
        expect(res.body.short_url.length).to.be.above(6);
        expect(res.body.original_url).equals(VALID_URL);
        done()
      })
      .catch(function (err) {
        throw err;
      });
  });

  it('responds with the original and the already generated short link when a duplicated valid url is posted', function (done) {
    const DUPLICATED_VALID_URL = { _id: "55555", original_url: 'http://www.facebook.com' }

    chai.request(server)
      .post('/api/shorturl/new')
      .send({ 'url': DUPLICATED_VALID_URL.original_url })
      .then(function (res) {
        expect(res).to.have.status(200);
        expect('Content-Type', /json/);
        expect(typeof res.body.short_url).equals('string');
        expect(res.body.short_url).equals(DUPLICATED_VALID_URL._id)
        expect(res.body.original_url).equals(DUPLICATED_VALID_URL.original_url);
        done();
      })
      .catch(function (err) {
        throw err;
      });
  });

  it('responds with 422 error when an invalid url hostname is posted', function (done) {

    chai.request(server)
      .post('/api/shorturl/new')
      .send({ 'url': "https://33" })
      .then(function (res) {
        expect(res).to.have.status(422);
        expect('Content-Type', /json/);
        expect(res.body).to.have.property('error')
        done();
      })
      .catch(function (err) {
        throw err;
      });
  });

  it('responds with 422 error when a non-http/https url protocol is posted', function (done) {

    chai.request(server)
      .post('/api/shorturl/new')
      .send({ 'url': "ftp://medium.com/" })
      .then(function (res) {
        expect(res).to.have.status(422);
        expect('Content-Type', /json/);
        expect(res.body).to.have.property('error')
        done();
      })
      .catch(function (err) {
        throw err;
      });
  });

  it('responds with 422 error when a url that the DNS fails to lookup is posted', function (done) {

    chai.request(server)
      .post('/api/shorturl/new')
      .send({ 'url': "http://not.a.website/" })
      .then(function (res) {
        expect(res).to.have.status(422);
        expect('Content-Type', /json/);
        expect(res.body).to.have.property('error')
        done();
      })
      .catch(function (err) {
        throw err;
      });
  });

});