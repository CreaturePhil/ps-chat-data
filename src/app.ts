import * as express from 'express';
import * as mongoose from 'mongoose';
import * as bodyParser from 'body-parser';
import * as fs from 'fs';

import mostUsedWord from './data/mostUsedWord';
import mostUsedPhrase from './data/mostUsedPhrase';

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
  mostUsedWord(Messages, 100, (word) => {
    res.json(word);
  });
});

app.get('/phrase', (req, res) => {
  mostUsedPhrase(Messages, 100, (phrase) => {
    res.json(phrase);
  });
});

app.listen(port, () => console.log('Listening on port ' + port));
