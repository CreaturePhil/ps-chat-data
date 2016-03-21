"use strict";
var _ = require('lodash');
function mostUsedPhrase(Messages, amount, callback) {
    Messages.find({}, function (err, data) {
        var words = _.chain(data)
            .map('message')
            .value();
        var phraseCount = _.reduce(words, function (acc, cur) {
            acc[cur] = (acc[cur] || 0) + 1;
            return acc;
        }, {});
        var keys = _.keys(phraseCount);
        var arr = _.map(keys, function (key) { return ({ phrase: key, count: phraseCount[key] }); });
        callback(_.sortBy(arr, 'count').reverse().slice(0, amount));
    });
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = mostUsedPhrase;
//# sourceMappingURL=mostUsedPhrase.js.map