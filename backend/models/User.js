const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const isValidEmail = (email) => {
    const regexEmail =
        /^((\w[^\W]+)[\.\-]?){1,}\@(([0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3})|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/ // RFC 5322 regex validation
    return regexEmail.test(email)
}


const userSchema = mongoose.Schema({
    email: { type: String, required: true, unique: true, validate: [isValidEmail, 'Please, indicate an valid mail address'] },
    password: { type: String, required: true }
});

userSchema.plugin(uniqueValidator);

module.exports = mongoose.model('User', userSchema);