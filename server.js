const express = require('express');
const db = require('./db');
const cors = require('cors');
const url = require('url');
const dns = require('dns');
const bodyParser = require('body-parser');
const shortid = require('shortid');
const app = express();


app.use(cors());
app.use(cors({ optionSuccessStatus: 200 }))
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/public', express.static(process.cwd() + '/public'));


app.get('/', function (req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

app.post('/api/shorturl/new', function (req, res) {
  const parsedUrl = url.parse(req.body.url);

  if (parsedUrl.hostname && (parsedUrl.protocol === "https:" || parsedUrl.protocol === "http:")) {
    dns.lookup(parsedUrl.hostname, 4, function (err) {
      if (err) return res.status(422).json({ error: "invalid URL" })
      db.getDb().collection('urls').findOne({ original_url: req.body.url }, (function (err, result) {
        if (err) throw err;
        if (!result) return addNew();
        else res.json({ original_url: result.original_url, short_url: result._id });
      })
      );
    })
  }
  else res.status(422).json({ error: "invalid URL" })

  function addNew() {
    db.getDb().collection('urls').insertOne({ _id: shortid.generate(), original_url: req.body.url }, function (err, results) {
      if (err) throw err;
      res.json({ "original_url": req.body.url, "short_url": results.insertedId });
    })
  }
})

app.get('/api/shorturl/:url', function (req, res) {
  db.getDb().collection('urls').findOne({ _id: req.params.url }, (function (err, result) {
    if (err) throw err;
    if (!result) return res.status(404).json({ "error": "link not found" });
    else res.redirect(result.original_url);
  })
  );
})


app.listen(process.env.PORT, function () {
  console.log(`Node.js listening on port ${process.env.PORT}`);
});