/**
 * Main application routes
 */

'use strict'
const router = require('koa-router')()
const post = require('../model/post')
const user = require('../model/user')
module.exports = function () {
    router
        .get('/posts/latest', async(ctx) => {
            ctx.body = await post.findAll()
        })
        .get('/posts/:documentId', async(ctx) => {
            ctx.body = await post.findAllById(ctx.params.documentId)
        })
        .get('/posts/:documentId/:postId', async(ctx) => {
            ctx.body = (await post.findById(ctx.params.documentId, ctx.params.postId))[0]
        })
        .post('/posts/', async(ctx) => {
            ctx.body = await post.add(ctx.request.body.documentId, ctx.request.body.postId, ctx.request.body.content, ctx.request.body.userId)
        })
        .put('/posts/:documentId/:postId', async(ctx) => {
            ctx.body = await post.updateById(ctx.params.documentId, ctx.params.postId, ctx.request.body.content, ctx.request.body.userId)
        })
        .del('/posts/:documentId/:postId/:userId', async(ctx) => {
            await post.delete(ctx.params.documentId, ctx.params.postId, ctx.params.userId)
            ctx.response.status = 204
        })
        .put('/posts/:documentId/:postId/like', async(ctx) => {
            await post.like(ctx.params.documentId, ctx.params.postId, ctx.request.body.userId)
            ctx.response.status = 204
        })
        .put('/posts/:documentId/:postId/unlike', async(ctx) => {
            await post.unlike(ctx.params.documentId, ctx.params.postId, ctx.request.body.userId)
            ctx.response.status = 204
        })
        .get('/users/', async(ctx) => {
            ctx.body = await user.findAll()
        })

    return router
}