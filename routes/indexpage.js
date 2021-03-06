var express = require('express');
var router = express.Router();
var IndexModel = require('../models/index')

//  POST 首页音频列表 -> /index/list
router.post('/list', function (req, res, next) {
    IndexModel.getAudioList(req.body)
        .then(function (data) {
            res.send(data)
        })
});
// POST filtrateTag 标签及标签下音频数量
router.post('/filtrate/tag', function (req, res, next) {
    IndexModel.getFiltrateTag(req.body)
        .then(function (data) {
            res.send(data)
        })
})
// POST 获取音频数量
router.post('/pages', function (req, res, next) {
    IndexModel.getAudioNum(req.body)
        .then(function (data) {
            res.send(data)
        })
})

// POST 搜索，模糊查询，音频名字，不区分大小写
router.post('/search', function (req, res, next) {
    IndexModel.getAudioBySearch(req.body)
        .then(function (data) {
            res.send(data)
        })
})

module.exports = router