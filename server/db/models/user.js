'use strict';
var crypto = require('crypto');
var mongoose = require('mongoose');
// mongoose.connect('mongodb://localhost/specstackular');
// mongoose.connection.on('error', console.error.bind(console, 'database connection error:'));

var schema = new mongoose.Schema({
    first_name: {
        type: String,
        required: true
    },
    middle_name: {
        type: String
    },
    last_name: {
        type: String,
        required: true
    },
    orders: [{type: mongoose.Schema.Types.ObjectId, ref: 'Order'}],
    email: {
        type: String
    },
    password: {
        type: String
    },
    salt: {
        type: String
    },
    // Commented out because we are not using Twitter oauth --Glenn
    //twitter: {
    //    id: String,
    //    username: String,
    //    token: String,
    //    tokenSecret: String
    //},
    facebook: {
        id: String
    },
    google: {
        id: String
    },
    reviews: [{type: mongoose.Schema.Types.ObjectId, ref: 'Review'}]
});



// generateSalt, encryptPassword and the pre 'save' and 'correctPassword' operations
// are all used for local authentication security.
var generateSalt = function () {
    return crypto.randomBytes(16).toString('base64');
};

var encryptPassword = function (plainText, salt) {
    var hash = crypto.createHash('sha1');
    hash.update(plainText);
    hash.update(salt);
    return hash.digest('hex');
};

schema.pre('save', function (next) {

    var user = this;

    if (user.isModified('password')) {
        user.salt = generateSalt();
        user.password = encryptPassword(user.password, user.salt);
    }

    next();

});

schema.method('correctPassword', function (candidatePassword) {
    return encryptPassword(candidatePassword, this.salt) === this.password;
});

module.exports = mongoose.model('User', schema);