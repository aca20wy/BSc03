let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let UserSchema = new Schema({
    userId: { type: String, required: true } // This acts as a simple form of authentication.
});

let User = mongoose.model('User', UserSchema);
module.exports = User;
