const mongoose = require('mongoose')
const user = require('./user')
const Schema = mongoose.Schema

const likeSchema = new Schema({
    name: { type: String, required: true, trim: true },
    _id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
})

const postSchema = new Schema({
    content: { type: String, required: true, trim: true },
    postedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    likes: [likeSchema],
    totalLikesCount: { type: Number, default: 0 },
    totalRepliesCount: { type: Number, default: 0 }
}, {
    timestamps: true
})

// recursive schema throw an exception
postSchema.add({ replies: [postSchema] })

// Defines static methods (repository)
postSchema.statics.findById = (id, cb) => Post.findOne({ _id: id }, cb).exec(cb)
postSchema.statics.findAll = (cb) => Post.find({}, cb).exec(cb)
postSchema.statics.add = (content, userId, cb) => Post.create({ content: content, postedBy: userId }, cb)
postSchema.statics.update = (id, userId, content, cb) => Post.findOneAndUpdate({ _id: id, postedBy: userId }, { content: content}, cb)
postSchema.statics.delete = (id, userId, cb) => Post.findOneAndRemove({ _id: id, postedBy: userId }, cb).exec(cb)

postSchema.statics.like = async (id, userId, cb) => {
    let liker = await user.findById(userId)
    return Post.findOneAndUpdate({ "_id": id, "likes._id": { "$ne": userId} }
    , { $push: { likes: new Like({ name: liker.name, _id: liker._id}) }, $inc: { totalLikesCount: 1 } }, cb)}
postSchema.statics.unlike = async (id, userId, cb) => Post.findOneAndUpdate({ "_id": id, "likes._id": userId },{ $pull: { likes: { _id : userId} }, $inc: { totalLikesCount: -1 } }, cb)

postSchema.statics.reply = async (id, userId, content, cb) => {
    return Post.findOneAndUpdate({ _id: id }, { $push: { replies: new Post({ content: content, postedBy: userId }) }, $inc: { totalRepliesCount: 1 } }, cb)
}

const Post = mongoose.model('Post', postSchema)
const Like = mongoose.model('Like', likeSchema)
module.exports = Post