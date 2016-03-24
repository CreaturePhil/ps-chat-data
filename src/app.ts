import * as express from 'express';
import * as mongoose from 'mongoose';
import * as bodyParser from 'body-parser';
import * as fs from 'fs';
import * as path from 'path';

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
  var stream = fs.createReadStream(path.join(__dirname, '../word.json'));
  stream.pipe(res);
});

app.get('/phrase', (req, res) => {
  var stream = fs.createReadStream(path.join(__dirname, '../phrase.json'));
  stream.pipe(res);
});

app.get('/user', (req, res) => {
  var stream = fs.createReadStream(path.join(__dirname, '../user.json'));
  stream.pipe(res);
});

app.get('/room', (req, res) => {
  var stream = fs.createReadStream(path.join(__dirname, '../room.json'));
  stream.pipe(res);
});

app.listen(port, () => console.log('Listening on port ' + port));
