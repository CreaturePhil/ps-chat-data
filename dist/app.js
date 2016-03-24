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
var l = {};
var MessageModel = new mongoose.Schema({
    name: String,
    message: String,
    date: { type: Date, default: Date.now },
    type: String,
    typeData: String
});
var Messages = mongoose.model('Message', MessageModel);
Messages.find({}, function (err, data) {
    var phrases = _.chain(data)
        .map('message')
        .value();
    l = reducer_1.default(phrases, 'phrase', 100);
});
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
    Messages.find({}, function (err, data) {
        var phrases = _.chain(data)
            .map('message')
            .value();
        l = reducer_1.default(phrases, 'phrase', 100);
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
app.get('/word', function (req, res, next) {
    var q = Messages.find({}).sort({ 'date': -1 }).limit(1000);
    console.time('hi');
    q.exec(function (err, data) {
        console.timeEnd('hi');
        var words = _.chain(data)
            .map('message')
            .map(_.words)
            .flatten()
            .value();
        res.json(reducer_1.default(words, 'word', 100));
    });
});
app.get('/phrase', function (req, res) {
    res.json(l);
});
app.get('/user', function (req, res) {
    var q = Messages.find({}).sort({ 'date': -1 }).limit(20000);
    q.exec(function (err, data) {
        Messages.find({}, function (err, data) {
            var names = _.chain(data)
                .map('name')
                .value();
            res.json(reducer_1.default(names, 'user', 100));
        });
    });
});
app.get('/room', function (req, res) {
    var q = Messages.find({}).sort({ 'date': -1 }).limit(20000);
    q.exec(function (err, data) {
        Messages.find({}, function (err, data) {
            var rooms = _.chain(data)
                .filter({ type: 'room' })
                .map('typeData')
                .value();
            res.json(reducer_1.default(rooms, 'room', 100));
        });
    });
});
app.listen(port, function () { return console.log('Listening on port ' + port); });
//# sourceMappingURL=app.js.map