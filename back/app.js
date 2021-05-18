const koa = new (require('koa'))()
const router = require('koa-router')()
const bodyparser = require('koa-bodyparser')
const templ = require('./routes/template.js')

koa.use(bodyparser())
koa.on('error', function(err, ctx) {
    console.log('server error: ', err);
});
router.use(templ.routes())

koa.use(router.routes())

koa.listen(9090, () => {
    console.log('Koa is listening on port 9090')
})
module.exports = koa