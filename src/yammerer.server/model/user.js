const mongoose = require('mongoose')
const Schema = mongoose.Schema

const UserSchema = new Schema({
    name: { type: String, unique: true, required: true, trim: true },
    avatar: { type: String, trim: true }
}, {
    timestamps: true
});

module.exports = mongoose.model('User', UserSchema)