const userController = require('../controller/template.js');
const router = require('koa-router')();

router
  .post('/template', userController.setTemplate)
  .post('/previewTemplate', userController.previewTemplate)

module.exports = router;