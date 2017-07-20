const mongoose = require('mongoose')
const Schema = mongoose.Schema

const userSchema = new Schema({
    name: { type: String, unique: true, required: true, trim: true },
    avatar: { type: String, trim: true }
}, {
    timestamps: true
})


/**
 * Get all the users from the db
 * @method findAll
 * @return {User[]} An array of users
 */
userSchema.statics.findAll = () => User.find({}).limit(5).lean().exec()

const User = mongoose.model('User', userSchema)
module.exports = User