var express = require("express");
var path= require('path')
var server = express();
var PORT = 3000;

server.get('/wms', function (request, response) {
    var params = request.query;
    console.log(params);
    if(params.SERVICE === 'WMS' && params.REQUEST === 'GetCapabilities'){
        response.sendFile(path.join(__dirname, 'wms_nase.xml'))
    }else if (params.SERVICE === 'WMS' && params.REQUEST === 'GetMap'){
        console.log('nejdeme robit get capa')
    }else {
        response.send('nepodporovana metoda')
    }

})

server.listen(PORT, function() {
    console.log("Server listening on port " + PORT + "!");
  });

