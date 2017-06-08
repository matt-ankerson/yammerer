/**
 * Main application routes
 */

'use strict'

const Router = require('koa-router')
const Boom = require('boom');

module.exports = function(app) {
    let router = new Router({
            prefix: '/posts'
        })
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

    app
        .use(router.routes())
        .use(router.allowedMethods({
            throw: true,
            notImplemented: () => new Boom.notImplemented(),
            methodNotAllowed: () => new Boom.methodNotAllowed()
        }))
}