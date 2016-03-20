import * as express from 'express';
import * as mongoose from 'mongoose';
import * as bodyParser from 'body-parser';

const app = express();

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
  console.log(req.body.token === token);
  console.log(req.body);
  console.log(req.body.token, token);
  if (req.body.token !== token) {
    return res.json({success: false});
  }
  const message = new Messages(req.body.data);
  message.save((err) => {
    if (err) {
      console.error(err);
      res.json({success: false});
    } else {
      res.json({success: true});
    }
  });
});

app.listen(port, () => console.log('Listening on port ' + port));