/**
 * Main application routes
 */

'use strict'
const router = require('koa-router')()
const post = require('../model/post')

module.exports = function () {
    router
        .prefix('/posts')
        .get('/:documentId', async(ctx) => {
            ctx.body = await post.findAllById(ctx.params.documentId)
        })
        .get('/:documentId/:postId', async(ctx) => {
            ctx.body = (await post.findById(ctx.params.documentId, ctx.params.postId))[0]
        })
        .post('/', async(ctx) => {
            await post.add(ctx.request.body.documentId, ctx.request.body.postId, ctx.request.body.content, ctx.request.body.userId)
            ctx.response.status = 204
        })
        .put('/', async(ctx) => {
            await post.updateById(ctx.request.body.documentId, ctx.request.body.postId, ctx.request.body.content, ctx.request.body.userId)
            ctx.response.status = 204
        })
        .del('/:documentId', async(ctx) => {
            await post.deleteAllById(ctx.params.documentId, ctx.request.body.userId)
            ctx.response.status = 204
        })
        .del('/:documentId/:postId', async(ctx) => {
            await post.deleteById(ctx.params.documentId, ctx.params.postId, ctx.request.body.userId)
            ctx.response.status = 204
        })
        .put('/:documentId/:postId/like', async(ctx) => {
            await post.like(ctx.params.documentId, ctx.params.postId, ctx.request.body.userId)
            ctx.response.status = 204
        })
        .put('/:documentId/:postId/unlike', async(ctx) => {
            await post.unlike(ctx.params.documentId, ctx.params.postId, ctx.request.body.userId)
            ctx.response.status = 204
        })

    return router
}