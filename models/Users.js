const mongoose = require("mongoose");
const bcrypt = require("bcrypt-nodejs");
const Schema = mongoose.Schema;



var UserSchema = new mongoose.Schema({
   first_name: String,
   last_name: String,
   username: String,
   photo: { type: String, default: 'https://s.pinimg.com/images/user/default_280.png' },
   email: { type: String, unique: true, lowercase: true },
   password: { type: String, default: '' },
   facebookId: String,
   googleId: String
   
});



UserSchema.methods.encryptPassword = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(10), null);
};

UserSchema.methods.comparePassword = function(password) {

    return bcrypt.compareSync(password, this.password);
};

module.exports = mongoose.model('Users', UserSchema);