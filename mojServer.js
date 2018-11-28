var express = require("express");
var path= require('path')
var server = express();
var PORT = 3000;
var fs = require("fs");
var mapnik = require("mapnik");
var ImageCreator = require('./Image_Creator.js');

console.log(ImageCreator);
//
server.use(express.static('znacky'));
//
server.get('/wms', function (request, response) {
    var params = request.query;
    console.log(params);
    if(params.SERVICE === 'WMS' && params.REQUEST === 'GetCapabilities'){
        response.sendFile(path.join(__dirname, 'wms_nase.xml'))
    }else if (params.SERVICE === 'WMS' && params.REQUEST === 'GetMap'){
        ImageCreator(params, response.sendFile.bind(response))
    }else {
        response.send('nepodporovana metoda')
    }

})

server.listen(PORT, function() {
    console.log("Server listening on port " + PORT + "!");
  });

