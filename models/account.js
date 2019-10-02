const mongoose = require('mongoose');
const config = require('config');

const accountSchema = new mongoose.Schema({
    email: {
        type : String,
        unique : true,
        required : true
    },
    firstname : String,
    lastname : String,
    hash : String,
    salt : String,
    createDate : Date
}, {
    collection : 'accounts',
});

mongoose.model('Account', accountSchema);