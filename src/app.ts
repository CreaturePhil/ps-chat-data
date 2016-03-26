import * as express from 'express';
import * as mongoose from 'mongoose';
import * as bodyParser from 'body-parser';
import * as fs from 'fs';
import * as path from 'path';
import * as _ from 'lodash';

const app = express();

app.set('json spaces', 4);

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended: false}));

// parse application/json
app.use(bodyParser.json());

const token: string = process.env.TOKEN;
const url: string = process.env.MONGODB || 'mongodb://localhost:27017/myproject';
const port: number = process.env.PORT || 3000;

mongoose.connect(url);

const MessageModel = new mongoose.Schema({
  name: String,
  message: String,
  date: {type: Date, default: Date.now},
  type: String,
  typeData: String
});

const Messages = mongoose.model('Message', MessageModel);
var stream = Messages.find({}).stream();
var phrases = {};
var words = {};
var users = {};
var rooms = {};
var i = 0;
stream.on('data', function (data) {
  if ((++i) % 1000 === 0) {
    console.log(i)
  }
  phrases[data.message] = (phrases[data.message] || 0) + 1;
  users[data.name] = (users[data.name] || 0) + 1;
  if (data.type === 'room') {
    rooms[data.typeData] = (rooms[data.typeData] || 0) + 1;
  }
  const w = _.words(data.message);
  _.forEach(w, word => {
    words[word] = (words[word] || 0) + 1;
  });
});
function reduce(counts, name, amount) {
 var keys = _.keys(counts);
 var data = _.map(keys, (key) => ({
   [name]: key, count: counts[key]
 }));
 return _.sortBy(data, 'count').reverse().slice(0, amount);
}

app.get('/', (req, res) => {
  res.send('hello world!');
});

app.post('/add', (req, res) => {
  if (req.body.token !== token) {
    return res.send('failure');
  }
  let message = new Messages({
    name: req.body.name,
    message: req.body.message,
    date: req.body.date,
    type: req.body.type,
    typeData: req.body.typeData
  });
  message.save((err) => {
    if (err) {
      console.error(err);
      res.send('failure');
    } else {
      res.send('success');
    }
  });
});

app.get('/word', (req, res) => {
  delete words['constructor'];
  res.json(reduce(words, 'word', 1000));
});

app.get('/phrase', (req, res) => {
  res.json(reduce(phrases, 'phrase', 1000));
});

app.get('/user', (req, res) => {
  res.json(reduce(users, 'user', 1000));
});

app.get('/room', (req, res) => {
  res.json(reduce(rooms, 'room', 1000));
});

app.listen(port, () => console.log('Listening on port ' + port));
