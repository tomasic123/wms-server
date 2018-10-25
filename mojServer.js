var express = require("express");
var path= reqire('path')
var server = express();
var PORT = 3000;

server.get('/wms', function (request, response) {
    var params = reqest.query;
    console.log(params);
    if(params.service === 'wms' && params.request === 'GetCapabilities'){
        response.sendFile(path.join(__dirname, ' ./capa/wms_nase.xml'))
    }else if (params.service === 'wms' && params.request === 'GetMap'){
        console.log('nejdeme robit get capa')
    }else {
        response.send('nepodporovana metoda')
    }

})
server.listen(PORT, function() {
    console.log("Server listening on port " + PORT + "!");
  });

