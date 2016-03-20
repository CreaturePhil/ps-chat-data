"use strict";
var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
var token = process.env.TOKEN;
var url = process.env.MONGODB || 'mongodb://localhost:27017/myproject';
var port = process.env.PORT || 3000;
mongoose.connect(url);
var MessageModel = new mongoose.Schema({
    name: String,
    message: String,
    date: { type: Date, default: Date.now },
    type: String,
    typeData: String
});
var Messages = mongoose.model('Message', MessageModel);
app.get('/', function (req, res) {
    res.send('hello world!');
});
app.post('/add', function (req, res) {
    console.log(req.body.token === token);
    console.log(req.body.token, token);
    if (req.body.token !== token) {
        return res.json({ success: false });
    }
    var message = new Messages(req.body.data);
    message.save(function (err) {
        if (err) {
            console.error(err);
            res.json({ success: false });
        }
        else {
            res.json({ success: true });
        }
    });
});
app.listen(port, function () { return console.log('Listening on port ' + port); });
//# sourceMappingURL=app.js.map