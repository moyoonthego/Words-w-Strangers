// app/models/user.js
// load the things we need
var mongoose = require('mongoose');

// define the schema for our user model
var userSchema = mongoose.Schema({

    local            : {
        account      : String,
        username     : String,
        email        : String,
        password     : String,
        first_name   : String,
        last_name    : String,
        phone        : String,
        address      : {
        	city     : String,
        	postcode : String,
        	province : String,
        	country  : String
        },
        words: [String]
    }

});

// checking if password is valid
userSchema.methods.validPassword = function(password) {
    return (password === this.local.password); 
};

// create the model for users and generalize it to our app
module.exports = mongoose.model('User', userSchema);
