var express = require('express');
var router = express.Router();
var fs = require('fs')
var request = require('request')

var path = require('path').join(__dirname, '../public')
var certPath = require('path').join(__dirname, '../cacert.pem')

var httpProxy = require('http-proxy'); 
var proxy = httpProxy.createProxyServer( {
    ssl : {
        cert : fs.readFileSync(certPath, 'utf8')
    },
    changeOrigin: true,
    target: {
        https: true
    }
});
//
//router.get('/proxy/lantmateriet.se/*', function(req, res, next) {
//    proxy.web(req, res, { target: 'https://api.lantmateriet.se'})
//});
//
router.get('/proxy/', function(req, res, next) {
    var url = req.query.url;
    var match = /^http:\/\/geodpags\.skogsstyrelsen\.se|^https:\/\/api\.lantmateriet\.se/.test(url)
    if(!match) return next();
    request(url).pipe(res);
});


router.get('/:region', function(req, res, next) {
  var id = req.params.region;
  res.sendFile('main.html', {root: path});  
});



//router.get('/data/:region/:type/:age', function(req, res, next) {
//  var region = req.params.region;
//  var type = req.params.type;
//  var age = req.params.age;
//  var file = type + region + '/' + age + '.json'
//  res.sendfile(file, {root: processedPath});  
//});


module.exports = router;
