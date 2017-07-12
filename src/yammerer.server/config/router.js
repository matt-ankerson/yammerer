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
            ctx.body = await post.create(ctx.request.body)
        })
        .put('/:id', async(ctx) => {
            await post.update(ctx.params.id, ctx.request.body.content)
            ctx.response.status = 204
        })
        .del('/:id', async(ctx) => {
            await post.delete(ctx.params.id)
            ctx.response.status = 204
        })
    
        return router    
}