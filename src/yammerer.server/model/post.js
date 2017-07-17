const mongoose = require('mongoose')
const user = require('./user')
const Schema = mongoose.Schema

const likeSchema = new Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    _id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
})

const commentSchema = new Schema({
    content: {
        type: String,
        required: true,
        trim: true
    },
    postedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    likes: [likeSchema],
    parents: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Post',
        required: true
    }],
    children: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Post',
        required: true
    }]
}, {
    timestamps: true
})

const postSchema = new Schema({
    comments: [commentSchema],
    postedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
})

/**
 * Get the whole document representing the post
 * @method findAllById
 * @param {String} documentId - the identifier of the document where the post is stored
 * @return {Post} The requested document
 */
postSchema.statics.findAllById = (documentId) => Post.findOne({
    _id: documentId
}).lean().exec()

/**
 * Get the comments related to a specific post
 * @method findById
 * @param {String} documentId - the identifier of the document where the post is stored
 * @param {String} postId - The post identifier.
 * @return {Post} The requested post
 */
postSchema.statics.findById = (documentId, postId) => Post.aggregate([{
        $match: {
            _id: mongoose.Types.ObjectId(documentId)
        }
    },
    {
        $project: {
            comments: {
                $filter: {
                    input: '$comments',
                    as: 'comments',
                    cond: {
                        $or: [{
                            $eq: ['$$comments._id', mongoose.Types.ObjectId(postId)]
                        }, {
                            $in: [mongoose.Types.ObjectId(postId), '$$comments.parents', ]
                        }]
                    }
                }
            }
        }
    }
]).exec()

/**
 * Create a new post or add a reply to an existing post
 * @method add
 * @param {String} documentId - the identifier of the document where the post is stored
 * @param {String} postId - The post identifier.
 * @param {String} content - The post content.
 * @param {String} userId - The user identifier.
 * @return {Post} The requested post
 */
postSchema.statics.add = async(documentId, postId, content, userId) => {
    let reply = new Comment({
        content: content,
        postedBy: userId
    });
    if (documentId && postId) {
        let document = await Post.findOne({
            _id: documentId,
            'comments._id': postId
        }, {
            'comments.$': 1
        }).exec()
        let post = document.comments[0];
        reply.parents = [...post.parents, postId]

        // push the new reply
        await Post.update({
            _id: documentId
        }, {
            $push: {
                comments: reply
            }
        }).exec()

        // update the parent post
        return Post.update({
            _id: documentId,
            'comments._id': postId
        }, {
            $push: {
                'comments.$.children': reply._id
            }
        }, {
            new: true
        }).exec()
    }

    return Post.create({
        postedBy: userId,
        comments: [reply]
    })
}

/**
 * Update the specified post inside the specified document
 * @method add
 * @param {String} documentId - the identifier of the document where the post is stored
 * @param {String} postId - The post identifier.
 * @param {String} content - The post content.
 * @param {String} userId - The user identifier.
 * @return {Post} The requested post
 */
postSchema.statics.updateById = (documentId, postId, content, userId) => Post.update({
    _id: documentId,
    'comments.postedBy': userId,
    'comments._id': postId
}, {
    'comments.$.content': content
}).exec()

/**
 * Delete all the posts inside a document
 * @method Delete
 * @param {String} documentId - the identifier of the document where the post is stored
 * @param {String} userId - The user identifier.
 * @param {requestCallback} callback - The callback that handles the response.
 */
postSchema.statics.deleteAllById = (documentId, userId) => Post.remove({
    _id: documentId,
    postedBy: userId
}).exec()

/**
 * Delete a post inside a document
 * @method Delete
 * @param {String} documentId - the identifier of the document where the post is stored
 * @param {String} postId - The post identifier.
 * @param {String} userId - The user identifier.
 */
postSchema.statics.deleteById = async(documentId, postId, userId) => {
    //Delete the post if exists
    let {
        nModified
    } = await Post.update({
        _id: documentId
    }, {
        $pull: {
            comments: {
                $and: [{
                    _id: postId
                }, {
                    postedBy: userId
                }]
            }
        }
    }).exec()

    if (nModified === 0) return;

    // Delete the children
    await Post.update({
        _id: documentId,
        'comments.parents': postId     
    }, {
        $pull: {comments : { parents: postId  }}
    }).exec()

    // Update the parent
    return Post.update({
        _id: documentId,
        'comments.children': postId
    }, {
        $pull: {
            'comments.$.children': postId
        }
    }).exec()
}

postSchema.statics.like = async(id, userId, cb) => {
    let liker = await user.findById(userId)
    return Post.findOneAndUpdate({
        '_id': id,
        'likes._id': {
            '$ne': userId
        }
    }, {
        $push: {
            likes: new Like({
                name: liker.name,
                _id: liker._id
            })
        },
        $inc: {
            totalLikesCount: 1
        }
    }, cb)
}
postSchema.statics.unlike = async(id, userId, cb) => Post.findOneAndUpdate({
    '_id': id,
    'likes._id': userId
}, {
    $pull: {
        likes: {
            _id: userId
        }
    },
    $inc: {
        totalLikesCount: -1
    }
}, cb)

postSchema.statics.reply = async(id, userId, content, cb) => {
    return Post.findOneAndUpdate({
        _id: id
    }, {
        $push: {
            replies: new Post({
                content: content,
                postedBy: userId
            })
        },
        $inc: {
            totalRepliesCount: 1
        }
    }, cb)
}

postSchema.statics.rereply = async(id, userId, replyId, content, cb) => {
    return Post.findOneAndUpdate({
        _id: id
    }, {
        $push: {
            replies: new Post({
                content: content,
                postedBy: userId
            })
        },
        $inc: {
            totalRepliesCount: 1
        }
    }, cb)
}

const Like = mongoose.model('Like', likeSchema)
const Comment = mongoose.model('Comment', commentSchema)
const Post = module.exports = mongoose.model('Post', postSchema)