"use strict";
var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var _ = require('lodash');
var reducer_1 = require('./data/reducer');
var app = express();
app.set('json spaces', 4);
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
    if (req.body.token !== token) {
        return res.send('failure');
    }
    var message = new Messages({
        name: req.body.name,
        message: req.body.message,
        date: req.body.date,
        type: req.body.type,
        typeData: req.body.typeData
    });
    message.save(function (err) {
        if (err) {
            console.error(err);
            res.send('failure');
        }
        else {
            res.send('success');
        }
    });
});
app.get('/word', function (req, res) {
    Messages.find({}, function (err, data) {
        var words = _.chain(data)
            .map('message')
            .map(_.words)
            .flatten()
            .value();
        res.json(reducer_1.default(words, 'word', 100));
    });
});
app.get('/phrase', function (req, res) {
    Messages.find({}, function (err, data) {
        var phrases = _.chain(data)
            .map('message')
            .value();
        res.json(reducer_1.default(phrases, 'phrase', 100));
    });
});
app.get('/user', function (req, res) {
    Messages.find({}, function (err, data) {
        var names = _.chain(data)
            .map('name')
            .value();
        res.json(reducer_1.default(names, 'user', 100));
    });
});
app.get('/room', function (req, res) {
    Messages.find({}, function (err, data) {
        var rooms = _.chain(data)
            .filter({ type: 'room' })
            .map('typeData')
            .value();
        res.json(reducer_1.default(rooms, 'room', 100));
    });
});
app.listen(port, function () { return console.log('Listening on port ' + port); });
//# sourceMappingURL=app.js.map