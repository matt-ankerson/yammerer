/**
 * Main application routes
 */

'use strict'
const router = require('koa-router')()
const post = require('../model/post')
const user = require('../model/user')
module.exports = function () {
    router
        .get('/posts/:documentId', async(ctx) => {
            ctx.body = await post.findAllById(ctx.params.documentId)
        })
        .get('/posts/:documentId/:postId', async(ctx) => {
            ctx.body = (await post.findById(ctx.params.documentId, ctx.params.postId))[0]
        })
        .post('/posts/', async(ctx) => {
            ctx.body = await post.add(ctx.request.body.documentId, ctx.request.body.postId, ctx.request.body.content, ctx.request.body.userId)
        })
        .put('/posts/', async(ctx) => {
            ctx.body = await post.updateById(ctx.request.body.documentId, ctx.request.body.postId, ctx.request.body.content, ctx.request.body.userId)
        })
        .del('/posts/:documentId', async(ctx) => {
            await post.deleteAllById(ctx.params.documentId, ctx.request.body.userId)
            ctx.response.status = 204
        })
        .del('/posts/:documentId/:postId', async(ctx) => {
            await post.deleteById(ctx.params.documentId, ctx.params.postId, ctx.request.body.userId)
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