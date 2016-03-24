import * as express from 'express';
import * as mongoose from 'mongoose';
import * as bodyParser from 'body-parser';
import * as fs from 'fs';
import * as _ from 'lodash';

import reduce from './data/reducer';

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

let l = {};

const MessageModel = new mongoose.Schema({
  name: String,
  message: String,
  date: {type: Date, default: Date.now},
  type: String,
  typeData: String
});

const Messages = mongoose.model('Message', MessageModel);

Messages.find({}, (err, data) => {
const phrases = _.chain(data)
 .map('message')
 .value();

 l = reduce(phrases, 'phrase', 100);
});

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
  Messages.find({}, (err, data) => {
  const phrases = _.chain(data)
   .map('message')
   .value();

   l = reduce(phrases, 'phrase', 100);
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

app.get('/word', (req, res, next) => {
  const q = Messages.find({}).sort({'date': -1}).limit(1000);
  console.time('hi')
  q.exec((err, data) => {
    console.timeEnd('hi')
    const words = _.chain(data)
     .map('message')
     .map(_.words)
     .flatten()
     .value();

     res.json(reduce(words, 'word', 100));
  });
});

app.get('/phrase', (req, res) => {
  res.json(l);
});

app.get('/user', (req, res) => {
  const q = Messages.find({}).sort({'date': -1}).limit(20000);
  q.exec((err, data) => {
    Messages.find({}, (err, data) => {
    const names = _.chain(data)
     .map('name')
     .value();

     res.json(reduce(names, 'user', 100));
    });
  });
});

app.get('/room', (req, res) => {
  const q = Messages.find({}).sort({'date': -1}).limit(20000);
  q.exec((err, data) => {
    Messages.find({}, (err, data) => {
    const rooms = _.chain(data)
     .filter({type: 'room'})
     .map('typeData')
     .value();

     res.json(reduce(rooms, 'room', 100));
    });
  });
});

app.listen(port, () => console.log('Listening on port ' + port));
