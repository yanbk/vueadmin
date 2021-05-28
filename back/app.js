const koa = new (require('koa'))()
const router = require('koa-router')()
const bodyparser = require('koa-bodyparser')
const templRoutes = require('./routes/template.js')
const userRoutes = require('./routes/user.js')

koa.use(bodyparser())
koa.on('error', function(err, ctx) {
    console.log('server error: ', err);
});

router.use(templRoutes.routes())
router.use(userRoutes.routes())

koa.use(router.routes())

koa.listen(9090, () => {
    console.log('Koa is listening on port 9090')
})
module.exports = koa