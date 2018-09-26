const MongoClient = require('mongodb').MongoClient;

var _db;

MongoClient.connect(process.env.MONGODB_URI, { useNewUrlParser: true }, function (err, db) {
  if (err) throw err;
  console.log("Successfully connected to MongoDB.");
  _db = db.db(process.env.MONGODB_DB)
})

function getDb() { return _db; }
module.exports.getDb = getDb;