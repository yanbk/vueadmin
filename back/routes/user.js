const userController = require('../controller/user.js');
const router = require('koa-router')();

router
  .get('/getUsers', userController.getUsers)

module.exports = router;