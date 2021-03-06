const mongoose = require('mongoose')
const Schema = mongoose.Schema

const userSchema = new Schema({
    name: { type: String, unique: true, required: true, trim: true },
    avatar: { type: String, trim: true }
}, {
    timestamps: true
})

// Defines static methods (repository)
userSchema.statics.findByName = (name, cb) => User.findOne({ name: name }, cb).exec(cb)
userSchema.statics.findById = (id, cb) => User.findOne({ _id: id }, cb).exec(cb)
userSchema.statics.findAll = (name, cb) => User.find({}, cb).exec(cb)

const User = mongoose.model('User', userSchema)
module.exports = User