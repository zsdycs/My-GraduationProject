var express = require('express');
var router = express.Router();
var checkLogin = require('../middleWares/check').checkLogin

/* GET */
router.get('/', checkLogin, function (req, res, next) {
  // 清空 session 中用户信息
  req.session.user = null
  // req.flash('success', '登出成功')
  // 登出成功后跳转到主页
  res.redirect('/')
});

module.exports = router