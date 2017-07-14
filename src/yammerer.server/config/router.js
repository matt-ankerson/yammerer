/**
 * Main application routes
 */

'use strict'
const router = require('koa-router')()
const post = require('../model/post')

module.exports = function() {
    router
        .prefix('/posts')
        .get('/', async(ctx) => {
            ctx.body = await post.findAll()
        })
        .get('/:id', async(ctx) => {
            ctx.body = await post.findById(ctx.params.id)
        })
        .post('/', async(ctx) => {
            ctx.body = await post.add(ctx.request.body.content, ctx.request.body.userId)
        })
        .put('/:id', async(ctx) => {
            await post.update(ctx.params.id, ctx.request.body.userId, ctx.request.body.content)
            ctx.response.status = 204
        })
        .del('/:id', async(ctx) => {
            await post.delete(ctx.params.id, ctx.request.body.userId)
            ctx.response.status = 204
        })
        .put('/:id/like', async(ctx) => {
            await post.like(ctx.params.id, ctx.request.body.userId)
            ctx.response.status = 204
        })
        .put('/:id/unlike', async(ctx) => {
            await post.unlike(ctx.params.id, ctx.request.body.userId)
            ctx.response.status = 204
        }) 
        .put('/:id/reply', async(ctx) => {
            ctx.body = await post.reply(ctx.params.id, ctx.request.body.userId, ctx.request.body.content)
        })
               
    
        return router    
}