var mongoose = require('mongoose');

var messageSchema = mongoose.Schema({
    id: Number,
    message: {type: String, trim: true, min: 0}
});

module.exports = mongoose.model('Message', messageSchema);
