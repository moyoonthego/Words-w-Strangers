var mongoose = require('mongoose');

var locationSchema = mongoose.Schema({
    names : [String],
    user : String
});

module.exports = mongoose.model('Location', locationSchema);
