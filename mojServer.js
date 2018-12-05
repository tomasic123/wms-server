// Import  balíkov z adresára node_modules, ktoré sú potrebné nainštalovať
var express = require("express"); //import balíka na tvorbu http servera
var path= require('path') // import balíka pre prácu s cestami

var server = express(); // vytvorí sa nová inštancia expresu v premennej
var PORT = 3000; // definovanie hodnoty pre premennú "port"
var fs = require("fs"); // nacitanie node File System do premennej "fs"
var mapnik = require("mapnik"); // definovanie knižnice na nykreslovanie mapy
var ImageCreator = require('./Image_Creator.js'); // privolanie a uloženie jskriptu "Image_Creator" do premennej "Image_Creator"

console.log(ImageCreator); // vygenerovanie výstupu "Image_Creator" do webovej konzoly
//
server.use(express.static('znacky')); // definovanie statickej cesty odkial sú čerpané značky pre bodove prvky vo vygenerovanej mape po spustení servera
//
server.get('/wms', function (request, response) { //definujte funkciu, ktorá sa zavolá, keď server dostane požiadavku na url http: // host: port / is made
    var params = request.query; // premennej "param" pridelí dopitované žiadosti
    console.log(params); // výpis do konzoly premennú "params"
    if(params.SERVICE === 'WMS' && params.REQUEST === 'GetCapabilities'){ // podmienka ak sa v budeme doppytovať  
        response.sendFile(path.join(__dirname, 'wms_nase.xml')) // odošle sa súbor (xml), ktorý sa nachádza v ceste / __dirname uloží globálnu cestu do adresára, v ktorom voláme skript
    }else if (params.SERVICE === 'WMS' && params.REQUEST === 'GetMap'){ // ak sa dopitujeme po "GetMap" odošle sa na server:
        ImageCreator(params, response.sendFile.bind(response)) // vygenerovaný mapový obraz
    }else { //V opačnom prípade vypíše
        response.send('nepodporovana metoda') // hláška vypísaná ak je dopyt vakonaný nesprávne
    }

})

server.listen(PORT, function() { //definovanie čo sa vypíše v konzole po správnom spustení servera
    console.log("Server listening on port " + PORT + "!"); // správa vypísaná po správnom spustení servera + port na ktorom server beží
  });
  //KONIEC

