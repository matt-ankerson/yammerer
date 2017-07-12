const mongoose = require('mongoose')
const Schema = mongoose.Schema

const likeSchema = new Schema({
    name: { type: String, required: true, trim: true },
    id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
})

const postSchema = new Schema({
    content: { type: String, required: true, trim: true },
    postedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    likes: [likeSchema],
    totalLikesCount: { type: Number, default: 0 },
}, {
    timestamps: true
})

// recursive schema throw an exception
postSchema.add({ replies: [postSchema] })

// Defines static methods (repository)
postSchema.statics.findById = (id, cb) => Post.findOne({ _id: id }, cb).exec(cb)
postSchema.statics.findAll = (cb) => Post.find({}, cb).exec(cb)
postSchema.statics.create = (post, cb) => Post.create({ content: post.content, postedBy: post.postedBy }, cb)
postSchema.statics.delete = (id, cb) => Post.remove({ _id: id }, cb)
postSchema.statics.update = (id, content, cb) => Post.findOneAndUpdate({ _id: id }, { content: content}, cb)

const Post = mongoose.model('Post', postSchema)
module.exports = Post