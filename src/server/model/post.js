const mongoose = require('mongoose')
const Schema = mongoose.Schema

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
    likes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
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
}, {
    timestamps: true
})

/**
 * Get all the posts from the db
 * @method findAll
 * @return {Post[]} An array of posts
 */
postSchema.statics.findAll = () => Post.find({}).sort({updatedAt: 'desc'}).limit(5).lean().exec()

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
        reply.parents = [postId, ...post.parents]

        // push the new reply
        await Post.update({
            _id: documentId
        }, {
            $push: {
                comments: reply
            }
        }).exec()

        // update the parent post
        await Post.update({
            _id: documentId,
            'comments._id': postId
        }, {
            $push: {
                'comments.$.children': reply._id
            }
        }, {
            new: true
        }).exec()

        return Post.findOne({
            _id: documentId
        }, {
            comments: {
                $elemMatch: {
                    _id: reply._id
                }
            }
        }).lean().exec();
    }

    return Post.create({
        postedBy: userId,
        comments: [reply]
    })
}

/**
 * Update the specified post inside the specified document
 * @method updateById
 * @param {String} documentId - the identifier of the document where the post is stored
 * @param {String} postId - The post identifier.
 * @param {String} content - The post content.
 * @param {String} userId - The user identifier.
 * @return {Post} The requested post
 */
postSchema.statics.updateById = (documentId, postId, content, userId) => {
    return Post.update({
        _id: documentId,
        comments : { $elemMatch: { _id: postId, postedBy: userId}}
    }, {
        'comments.$.content': content
    }).exec()
}

/**
 * Delete a post. if the post is the main post also remove the document
 * @method delete
 * @param {String} documentId - the identifier of the document where the post is stored
 * @param {String} postId - The post identifier.
 * @param {String} userId - The user identifier.
 */
postSchema.statics.delete = async(documentId, postId, userId) => {
    // Delete the post if exists
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
        $pull: {
            comments: {
                parents: postId
            }
        }
    }).exec()

    // Update the parent
    await Post.update({
        _id: documentId,
        'comments.children': postId
    }, {
        $pull: {
            'comments.$.children': postId
        }
    }).exec()

    let document = await Post.aggregate([{
        $match: {
            _id: mongoose.Types.ObjectId(documentId)
        }
    }, {
        "$project": {
            "comment_count": {
                "$size": "$comments"
            }
        }
    }])

    if (document[0].comment_count > 0) return;

    // Remove the post if empty
    await Post.remove({
        _id: documentId,
        postedBy: userId
    }).exec()
}

/**
 * Like a post
 * @method like
 * @param {String} documentId - the identifier of the document where the post is stored
 * @param {String} postId - The post identifier.
 * @param {String} userId - The user identifier.
 */
postSchema.statics.like = async(documentId, postId, userId) => Post.update({
    _id: documentId,
    'comments._id': postId,
    'comments.likes': {
        '$ne': userId
    }
}, {
    $push: {
        'comments.$.likes': userId
    }
}).exec()

/**
 * Unlike a post
 * @method unlike
 * @param {String} documentId - the identifier of the document where the post is stored
 * @param {String} postId - The post identifier.
 * @param {String} userId - The user identifier.
 */
postSchema.statics.unlike = async(documentId, postId, userId) => Post.update({
    _id: documentId,
    'comments._id': postId,
    'comments.likes': userId
}, {
    $pull: {
        'comments.$.likes': userId
    }
}).exec()

const Comment = mongoose.model('Comment', commentSchema)
const Post = module.exports = mongoose.model('Post', postSchema)