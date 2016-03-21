"use strict";
var _ = require('lodash');
function reduce(array, name, amount) {
    var counts = _.reduce(array, function (acc, cur) {
        acc[cur] = (acc[cur] || 0) + 1;
        return acc;
    }, {});
    var keys = _.keys(counts);
    var data = _.map(keys, function (key) { return ((_a = {},
        _a[name] = key,
        _a.count = counts[key],
        _a
    )); var _a; });
    return _.sortBy(data, 'count').reverse().slice(0, amount);
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = reduce;
//# sourceMappingURL=reducer.js.map