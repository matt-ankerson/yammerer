const router = require('koa-router')()

module.exports = function() {
    router
        .prefix('/posts')
        .get('/', (ctx) => {
            ctx.body = 'Get all posts'
        })
        .get('/:id', (ctx) => {
            ctx.body = 'Get a single post'
        })
        .post('/', (ctx) => {
            ctx.body = 'Add a new post'
        })
        .put('/:id', async(ctx) => {
            ctx.body = 'Update an existing post'
        })
        .del('/:id', async(ctx) => {
            ctx.body = 'Delete a post'
        })

    return router
}
