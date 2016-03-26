"use strict";
var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var _ = require('lodash');
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
var stream = Messages.find({}).stream();
var phrases = {};
var words = {};
var users = {};
var rooms = {};
var i = 0;
stream.on('data', function (data) {
    phrases[data.message] = (phrases[data.message] || 0) + 1;
    users[data.name] = (users[data.name] || 0) + 1;
    if (data.type === 'room') {
        rooms[data.typeData] = (rooms[data.typeData] || 0) + 1;
    }
    var w = _.words(data.message);
    _.forEach(w, function (word) {
        words[word] = (words[word] || 0) + 1;
    });
});
function reduce(counts, name, amount) {
    var keys = _.keys(counts);
    var data = _.map(keys, function (key) { return ((_a = {},
        _a[name] = key,
        _a.count = counts[key],
        _a
    )); var _a; });
    return _.sortBy(data, 'count').reverse().slice(0, amount);
}
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
            var data = req.body;
            phrases[data.message] = (phrases[data.message] || 0) + 1;
            users[data.name] = (users[data.name] || 0) + 1;
            if (data.type === 'room') {
                rooms[data.typeData] = (rooms[data.typeData] || 0) + 1;
            }
            var w = _.words(data.message);
            _.forEach(w, function (word) {
                words[word] = (words[word] || 0) + 1;
            });
        }
    });
});
app.get('/word', function (req, res) {
    delete words['constructor'];
    res.json(reduce(words, 'word', 1000));
});
app.get('/phrase', function (req, res) {
    res.json(reduce(phrases, 'phrase', 1000));
});
app.get('/user', function (req, res) {
    res.json(reduce(users, 'user', 1000));
});
app.get('/room', function (req, res) {
    res.json(reduce(rooms, 'room', 1000));
});
app.listen(port, function () { return console.log('Listening on port ' + port); });
//# sourceMappingURL=app.js.map