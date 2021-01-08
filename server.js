const express = require('express');
const bodyParser = require('body-parser')
const path = require('path');
const app = express();
const tokenGenerator = require('./token_generator');

// load configuration from .env if available
require('dotenv').config();

app.use(express.static(path.join(__dirname, 'build')));

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());


app.get('/token/:id?', (req, res) => {
  const id = req.params.id;
  res.send(tokenGenerator(id));
});

app.post('/token', (req, res) => {
  const id = req.body.id;
  res.send(tokenGenerator(id));
});


app.get('/ping', function (req, res) {
 return res.send('pong');
});

app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

let port = process.env.PORT || 5000;
console.log(`Listening on port ${port}`);
app.listen(port);
