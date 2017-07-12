/**
 * Main application routes
 */

'use strict'
const router = require('koa-router')()

module.exports = function() {
    router
        .prefix('/posts')
        .get('/', async(ctx) => {
            ctx.body = 'Get All Posts!'
        })
        .get('/:id', async(ctx) => {
            ctx.body = 'Get one Post!'
        })
        .post('/', async(ctx) => {
            ctx.body = 'Create a new Post!'
        })
        .put('/:id', async(ctx) => {
            ctx.body = 'Update a Post!'
        })
        .del('/:id', async(ctx) => {
            ctx.body = 'Delete a Post!'
        })
    
        return router    
}