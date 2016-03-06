var express = require('express');
var router = express.Router();
var path = require('path');
var fs = require('fs');

var areas = require(path.join(__dirname, '../public/areas.json'))

var newsPath = path.join(__dirname, '../../news.json')

/* GET home page. */
router.get('/', function(req, res, next) {
  fs.readFile(newsPath, 'utf8', function (err, data) {
    if (err) data = "[]";
    data = JSON.parse(data);
    if(!data) data = []
    res.render('index', { areas: areas , news: data});
  });
});

module.exports = router;
