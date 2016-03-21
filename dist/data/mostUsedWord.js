"use strict";
var _ = require('lodash');
function mostUsedWord(Messages, amount, callback) {
    Messages.find({}, function (err, data) {
        var words = _.chain(data)
            .map('message')
            .map(_.words)
            .flatten()
            .value();
        var wordCount = _.reduce(words, function (acc, cur) {
            acc[cur] = (acc[cur] || 0) + 1;
            return acc;
        }, {});
        var keys = _.keys(wordCount);
        var arr = _.map(keys, function (key) { return ({ word: key, count: wordCount[key] }); });
        callback(_.sortBy(arr, 'count').reverse().slice(0, amount));
    });
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = mostUsedWord;
//# sourceMappingURL=mostUsedWord.js.map