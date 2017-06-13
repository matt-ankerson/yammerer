'use strict'

const router = require('koa-router')()
const posts = [{
    id: 0,
    content: 'Test Message',
    postedBy: 0
}, {
    id: 1,
    content: 'Test Message2',
    postedBy: 0
}];
const users = [{
    id: 0,
    username: 'Thomas'
}, {
    id: 0,
    username: 'Matt'
}];

const getUser = function(ctx, id) {
    let _id = parseInt(id)
    if (!Number.isInteger(_id)) {
        ctx.throw('Invalid data', 400);
    }

    let user = users.filter(u => u.id === _id)[0]
    if (!user) {
        ctx.throw('User not found', 404);
    }

    return user;
}

const getPost = function(ctx, id) {
    let _id = parseInt(id)
    if (!Number.isInteger(_id)) {
        ctx.throw('Invalid data', 400);
    }

    let post = posts.filter(p => p.id === _id)[0]
    if (!post) {
        ctx.throw('Post not found', 404);
    }

    return post;
}

const validatePost = function(ctx, content, postedBy) {
    if (!content) {
        ctx.throw('Content cannot be null', 400);
    }

    // validate user exists
    let user = getUser(ctx, postedBy);
}

module.exports = function() {
    router
        .prefix('/posts')
        .get('/', (ctx) => {
            ctx.body = posts
        })
        .get('/:id', (ctx) => {
            ctx.body = getPost(ctx, ctx.params.id)
        })
        .post('/', (ctx) => {
            validatePost(ctx, ctx.request.body.content, ctx.request.body.postedBy)
            let post = ctx.request.body
            post.id = posts.length
            posts.push(post)
            ctx.response.status = 201
        })
        .put('/:id', async(ctx) => {
            let exisitingPost = getPost(ctx, ctx.params.id)
            validatePost(ctx, ctx.request.body.content, ctx.request.body.postedBy)
            exisitingPost.content = ctx.request.body.content

            // replace the post in the collection
            posts.splice(posts.indexOf(exisitingPost), 1, exisitingPost)

            ctx.response.status = 204
        })
        .del('/:id', async(ctx) => {
            let exisitingPost = getPost(ctx, ctx.params.id)

            // Delete the element from the collection
            posts.splice(posts.indexOf(exisitingPost), 1)

            ctx.response.status = 200
        })

    return router
}