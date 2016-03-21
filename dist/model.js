"use strict";
var mongoose = require('mongoose');
var MessageModel = new mongoose.Schema({
    name: String,
    message: String,
    date: { type: Date, default: Date.now },
    type: String,
    typeData: String
});
var Messages = mongoose.model('Message', MessageModel);
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Messages;
//# sourceMappingURL=model.js.map