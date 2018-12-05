var path = require("path"); // import balíka pre prácu s cestami
var fs = require("fs"); // import balíka pre prácu s FileSystem
var mapnik = require("mapnik"); // knižnica na nykreslovanie mapy

mapnik.register_default_fonts(); // registrovanie niektoré predvolené fonty do mapniku
mapnik.register_default_input_plugins(); // podobne zaregistruje pluginy

function ImageCreator(arg, sendFile){  // vytvorenie funkcie na tvorbu obrazu
    var width = Number(arg.WIDTH); // definovanie šírky mapoveho okna z načítaných dát a ich prevod na numerický tvar
    var height = Number(arg.HEIGHT); // definovanie výšky mapoveho okna z načítaných dát a ich prevod na numerický tvar
    var BBOX = arg.BBOX.split(',').map(function(elem){
        return Number(elem)}); // obdobne definovanie rohov mapového okna (pravý horný a ľavý dolný) z načítaných stringov, ktoré sú prevedené na numerický tvar 
    var layers=(arg.LAYERS).split(',');

    var map = new mapnik.Map(width, height);
// definovanie premennej, ktorá bude obsahovať nové objekty mapy s definovanou šírkou

    var addBudovy=arg.LAYERS.includes('budovy'); // definovanie premennej, ktorej sa priradí príslušná vrstva
    var addCesty=arg.LAYERS.includes('cesty');
    var addChodniky=arg.LAYERS.includes('chodniky');
    var addCintorin=arg.LAYERS.includes('cintorin');
    var addLavicky=arg.LAYERS.includes('lavicky');
    var addOdpad=arg.LAYERS.includes('odpad');
    var addParkovisko=arg.LAYERS.includes('parkovisko');
    var addSluzby=arg.LAYERS.includes('sluzby');
    var addIne=arg.LAYERS.includes('ine');


    var proj = "+proj=krovak +lat_0=49.5 +lon_0=24.83333333333333 +alpha=30.28813972222222 +k=0.9999 +x_0=0 +y_0=0 +ellps=bessel +towgs84=589,76,480,0,0,0,0 +units=m +no_defs";
    // premennou proj sa definuje projekcia (resp. súr. systém) vo výraze "" sú definované transformačné parametre
    var style_budovy='<Style name="style_budovy">' + // štýlovanie vrstvy **** tento sa bude opakovať pre každú vrstvu a hovorí, že element style_name bude mať atribut "style_****"" 
        '<Rule>' +  // tagy do ktorých budú zapísané štýlovacie parametre vrstvy
            '<PolygonSymbolizer fill="#ff6d6d"  />' + // definovanie štýlu pre polygonovu časť vrstvy (fill- farba výplne)
            '<LineSymbolizer stroke="black" stroke-width="0.1" />' + // definovanie štýlu pre líniovú časť vrstvy (stroke - farba línie; strokewidth- hrúbka línie)
        '</Rule>' + //ukončenie elementu Rule
    '</Style>' //ukončenie elementu Style

    var style_cesty='<Style name="style_cesty">' + // štýlovanie vrstvy **** tento sa bude opakovať pre každú vrstvu a hovorí, že element style_name bude mať atribut "style_****"" 
        '<Rule>' + // bolo pipísané vyššie
            '<MinScaleDenominator>8001</MinScaleDenominator>'+ //definovanie mierky od ktorej sa vrstva zobrazí
            '<LineSymbolizer stroke="black" stroke-width="1"/>' + // bolo pipísané vyššie
        '</Rule>' + // bolo pipísané vyššie
        '<Rule>' + // bolo pipísané vyššie
            '<MaxScaleDenominator>8000</MaxScaleDenominator>'+ //definovanie mierky po ktorú sa vrstva bude zobrazovať
            '<MinScaleDenominator>3001</MinScaleDenominator>'+ // bolo pipísané vyššie
            '<LineSymbolizer stroke="#99897e" stroke-width="5" stroke-linecap="round" />' + // stroke linecap definuje zakončenie líie
        '</Rule>' + // bolo pipísané vyššie
        '<Rule>' + // bolo pipísané vyššie
            '<MaxScaleDenominator>8000</MaxScaleDenominator>'+ // bolo pipísané vyššie
            '<MinScaleDenominator>3001</MinScaleDenominator>'+ // bolo pipísané vyššie
            '<LineSymbolizer stroke="black" stroke-width="1" stroke-dasharray="4 2" />' + // stroke-dasharray vytvorí delenú čiaru s definovaním veľkosti čiarky a medzery 
        '</Rule>' + // bolo pipísané vyššie
        '<Rule>' + // bolo pipísané vyššie
            '<MaxScaleDenominator>8000</MaxScaleDenominator>'+ // bolo pipísané vyššie
            '<MinScaleDenominator>3001</MinScaleDenominator>'+ // bolo pipísané vyššie
            '<LineSymbolizer stroke="black" stroke-width="1" offset="3" />' + // offset odsadí líniu
        '</Rule>' + // bolo pipísané vyššie
        '<Rule>' + // bolo pipísané vyššie
            '<MaxScaleDenominator>8000</MaxScaleDenominator>'+ // bolo pipísané vyššie
            '<MinScaleDenominator>3001</MinScaleDenominator>'+ // bolo pipísané vyššie
            '<LineSymbolizer stroke="black" stroke-width="1" offset="-3" />' + // bolo pipísané vyššie
        '</Rule>' + // bolo pipísané vyššie

//////// Ďalej už nebudem popisovať časti, ktoré boli už raz popísané

        '<Rule>' + 
            '<MaxScaleDenominator>3000</MaxScaleDenominator>'+ 
            '<MinScaleDenominator>200</MinScaleDenominator>'+
            '<LineSymbolizer stroke="#99897e" stroke-width="8" stroke-linecap="round"/>' + 
        '</Rule>' +
        '<Rule>' +
            '<MaxScaleDenominator>3000</MaxScaleDenominator>'+
            '<MinScaleDenominator>200</MinScaleDenominator>'+
            '<LineSymbolizer stroke="black" stroke-width="2" stroke-dasharray="4 2" />' + 
        '</Rule>' +
        '<Rule>' +
            '<MaxScaleDenominator>3000</MaxScaleDenominator>'+
            '<MinScaleDenominator>200</MinScaleDenominator>'+
            '<LineSymbolizer stroke="black" stroke-width="1" offset="4" />' + 
        '</Rule>' +
        '<Rule>' +
            '<MaxScaleDenominator>3000</MaxScaleDenominator>'+
            '<MinScaleDenominator>200</MinScaleDenominator>'+
            '<LineSymbolizer stroke="black" stroke-width="1" offset="-4" />' + 
        '</Rule>' +
        
        '<Rule>' +
            '<MaxScaleDenominator>199</MaxScaleDenominator>'+
            '<MinScaleDenominator>1</MinScaleDenominator>'+
            '<LineSymbolizer stroke="#99897e" stroke-width="80" stroke-linecap="round"/>' + 
        '</Rule>' +
        '<Rule>' +
            '<MaxScaleDenominator>199</MaxScaleDenominator>'+
            '<MinScaleDenominator>1</MinScaleDenominator>'+
            '<LineSymbolizer stroke="black" stroke-width="5" stroke-dasharray="20 5" />' + 
        '</Rule>' +
        '<Rule>' +
            '<MaxScaleDenominator>199</MaxScaleDenominator>'+
            '<MinScaleDenominator>1</MinScaleDenominator>'+
            '<LineSymbolizer stroke="black" stroke-width="3" offset="40" />' + 
        '</Rule>' +
        '<Rule>' +
            '<MaxScaleDenominator>199</MaxScaleDenominator>'+
            '<MinScaleDenominator>1</MinScaleDenominator>'+
            '<LineSymbolizer stroke="black" stroke-width="3" offset="-40" />' + 
        '</Rule>' +           
    '</Style>'

    var style_chodniky='<Style name="style_chodniky">' +       
        '<Rule>' +
            '<MaxScaleDenominator>3000</MaxScaleDenominator>'+
            '<MinScaleDenominator>200</MinScaleDenominator>'+
            '<LineSymbolizer stroke="#8c400b" stroke-width="3" />' +
        '</Rule>' +
        '<Rule>' +
            '<MaxScaleDenominator>3000</MaxScaleDenominator>'+
            '<MinScaleDenominator>200</MinScaleDenominator>'+
            '<LineSymbolizer stroke="#61ff23" stroke-width="3"  stroke-dasharray="4, 2"/>' +
        '</Rule>' +
        '<Rule>' +
            '<MaxScaleDenominator>3000</MaxScaleDenominator>'+
            '<MinScaleDenominator>200</MinScaleDenominator>'+
            '<LineSymbolizer stroke="black" stroke-width="0.5" offset="1.5" />' + 
        '</Rule>' +
        '<Rule>' +
            '<MaxScaleDenominator>3000</MaxScaleDenominator>'+
            '<MinScaleDenominator>200</MinScaleDenominator>'+
            '<LineSymbolizer stroke="black" stroke-width="0.5" offset="-1.5" />' + 
        '</Rule>' +
        
        '<Rule>' +
            '<MaxScaleDenominator>199</MaxScaleDenominator>'+
            '<MinScaleDenominator>1</MinScaleDenominator>'+
            '<LineSymbolizer stroke="#8c400b" stroke-width="5" />' + 
        '</Rule>' +
        '<Rule>' +
            '<MaxScaleDenominator>199</MaxScaleDenominator>'+
            '<MinScaleDenominator>1</MinScaleDenominator>'+
            '<LineSymbolizer stroke="#61ff23" stroke-width="5"  stroke-dasharray="4, 2"/>' + 
        '</Rule>' +
        '<Rule>' +
            '<MaxScaleDenominator>199</MaxScaleDenominator>'+
            '<MinScaleDenominator>1</MinScaleDenominator>'+
            '<LineSymbolizer stroke="black" stroke-width="1" offset="2.5" />' + 
        '</Rule>' +
        '<Rule>' +
            '<MaxScaleDenominator>199</MaxScaleDenominator>'+
            '<MinScaleDenominator>1</MinScaleDenominator>'+
            '<LineSymbolizer stroke="black" stroke-width="1" offset="-2.5" />' + 
        '</Rule>' + 
    '</Style>'
    
    var style_cintorin='<Style name="style_cintorin">' + 
        '<Rule>' +
            '<LineSymbolizer stroke="black" stroke-width="0.1" />' + 
            '<PolygonSymbolizer fill="#633977"  />' + 
        '</Rule>' +
        '<Rule>'+
            '<MaxScaleDenominator>8000</MaxScaleDenominator>'+
            '<MinScaleDenominator>3001</MinScaleDenominator>'+
            '<PolygonPatternSymbolizer file="./znacky/cross1.png"/>'+ // definovanie vyplnenia plochy polygónu vzorom, ktorého cesta uloženia sa nachádza na uvedenej adrese
        '</Rule>'+
        '<Rule>'+
            '<MaxScaleDenominator>3000</MaxScaleDenominator>'+
            '<MinScaleDenominator>301</MinScaleDenominator>'+
            '<PolygonPatternSymbolizer file="./znacky/cross2.png"/>'+
        '</Rule>'+
        '<Rule>'+
            '<MaxScaleDenominator>300</MaxScaleDenominator>'+
            '<MinScaleDenominator>1</MinScaleDenominator>'+
            '<PolygonPatternSymbolizer file="./znacky/cross.png"/>'+
        '</Rule>'+
    '</Style>' 

    var style_lavicky='<Style name="style_lavicky">' + 
        '<Rule>' +
            '<MaxScaleDenominator>2000</MaxScaleDenominator>' +
            '<MinScaleDenominator>200</MinScaleDenominator>'+
            '<PointSymbolizer file= "./znacky/bench.png" transform="scale(0.05,0.05)" />'+ // definovanie symbolu ktorým sa zobrazí vrstva v mape; transform zmení mierku symbolu
            '</Rule>' +
            '<Rule>' +
                '<MaxScaleDenominator>199</MaxScaleDenominator>' +
                '<MinScaleDenominator>1</MinScaleDenominator>'+
                '<PointSymbolizer file= "./znacky/bench.png" transform="scale(0.1,0.1)" />'+
            '</Rule>' +
    '</Style>'

    var style_odpad='<Style name="style_odpad">' + 
        '<Rule>' +
            '<MaxScaleDenominator>2000</MaxScaleDenominator>' +
            '<MinScaleDenominator>200</MinScaleDenominator>'+
            '<PointSymbolizer file= "./znacky/trash2.png" transform="scale(0.03,0.03)"  />'+
        '</Rule>' +
        '<Rule>' +
            '<MaxScaleDenominator>199</MaxScaleDenominator>' +
            '<MinScaleDenominator>1</MinScaleDenominator>'+
            '<PointSymbolizer file= "./znacky/trash2.png" transform="scale(0.2,0.2)" />'+
        '</Rule>' +
    '</Style>' 
    
    var style_parkovisko='<Style name="style_parkovisko">' + 
        '<Rule>' +
            '<PolygonSymbolizer fill="#00fffa"  stroke-opacity="0.1" />' + 
            '<LineSymbolizer stroke="black" stroke-width="0.5" />' + 
        '</Rule>' +  
        '<Rule>' +
            '<MaxScaleDenominator>2000</MaxScaleDenominator>' +
            '<MinScaleDenominator>500</MinScaleDenominator>'+
            '<PointSymbolizer file= "./znacky/parking.png" transform="scale(0.05,0.05)" />'+
        '</Rule>' +
        '<Rule>' +
            '<MaxScaleDenominator>499</MaxScaleDenominator>' +
            '<MinScaleDenominator>200</MinScaleDenominator>'+
            '<PointSymbolizer file= "./znacky/parking.png" transform="scale(0.08,0.08)" />'+
        '</Rule>' +
        '<Rule>' +
            '<MaxScaleDenominator>199</MaxScaleDenominator>' +
            '<MinScaleDenominator>0.1</MinScaleDenominator>'+
            '<PointSymbolizer file= "./znacky/parking.png" transform="scale(0.2,0.2)" />'+
        '</Rule>' +
    '</Style>' 

    var style_sluzby='<Style name="style_sluzby">' + 
        '<Rule>' +
            '<MaxScaleDenominator>8000</MaxScaleDenominator>' +
            '<MinScaleDenominator>4001</MinScaleDenominator>'+
            "<Filter>[TYP] = 'posta'</Filter>" + // výber objektov z vrstvy podľa vybraného atribútu, pre ktoré sa vykoná následovné zobrazenie
            '<MarkersSymbolizer file= "./znacky/post.png" width="15" height="15"  />'+ // definovanie symbolu, ktorým sa zobrazí vrstva v mape a jeho rozmer v pix
        '</Rule>' +
        '<Rule>' +
            '<MaxScaleDenominator>4000</MaxScaleDenominator>' +
            '<MinScaleDenominator>201</MinScaleDenominator>'+
            "<Filter>[TYP] = 'posta'</Filter>" +
            '<MarkersSymbolizer file= "./znacky/post.png" width="25" height="25"  />'+
        '</Rule>' +
        '<Rule>' +
            '<MaxScaleDenominator>200</MaxScaleDenominator>' +
            '<MinScaleDenominator>0.1</MinScaleDenominator>'+
            "<Filter>[TYP] = 'posta'</Filter>" +
            '<MarkersSymbolizer file= "./znacky/post.png" width="50" height="50"  />'+
        '</Rule>' +

        '<Rule>' +
            '<MaxScaleDenominator>8000</MaxScaleDenominator>' +
            '<MinScaleDenominator>4001</MinScaleDenominator>'+
            "<Filter>[TYP] = 'hasicska_stanica'</Filter>" +
            '<MarkersSymbolizer file= "./znacky/hasici3.png" width="20" height="20"  />'+
        '</Rule>' +
        '<Rule>' +
            '<MaxScaleDenominator>4000</MaxScaleDenominator>' +
            '<MinScaleDenominator>201</MinScaleDenominator>'+
            "<Filter>[TYP] = 'hasicska_stanica'</Filter>" +
            '<MarkersSymbolizer file= "./znacky/hasici3.png" width="30" height="30"  />'+
        '</Rule>' +
        '<Rule>' +
            '<MaxScaleDenominator>200</MaxScaleDenominator>' +
            '<MinScaleDenominator>0.1</MinScaleDenominator>'+
            "<Filter>[TYP] = 'hasicska_stanica'</Filter>" +
            '<MarkersSymbolizer file= "./znacky/hasici3.png" width="70" height="70"  />'+
        '</Rule>' +  

    '<Rule>' +
        '<MaxScaleDenominator>8000</MaxScaleDenominator>' +
        '<MinScaleDenominator>4001</MinScaleDenominator>'+
        "<Filter>[TYP] = 'kniznica'</Filter>" +
        '<MarkersSymbolizer file= "./znacky/lib.png" width="20" height="20"  />'+
    '</Rule>' +
    '<Rule>' +
        '<MaxScaleDenominator>4000</MaxScaleDenominator>' +
        '<MinScaleDenominator>201</MinScaleDenominator>'+
        "<Filter>[TYP] = 'kniznica'</Filter>" +
        '<MarkersSymbolizer file= "./znacky/lib.png" width="30" height="30"  />'+
    '</Rule>' +
    '<Rule>' +
        '<MaxScaleDenominator>200</MaxScaleDenominator>' +
        '<MinScaleDenominator>0.1</MinScaleDenominator>'+
        "<Filter>[TYP] = 'kniznica'</Filter>" +
        '<MarkersSymbolizer file= "./znacky/lib.png" width="70" height="70"  />'+
    '</Rule>' +          
    
    '<Rule>' +
        '<MaxScaleDenominator>8000</MaxScaleDenominator>' +
        '<MinScaleDenominator>4001</MinScaleDenominator>'+
        "<Filter>[TYP] = 'obecny_urad'</Filter>" +
        '<MarkersSymbolizer file= "./znacky/urad.png" width="20" height="20"  />'+
    '</Rule>' +
    '<Rule>' +
        '<MaxScaleDenominator>4000</MaxScaleDenominator>' +
        '<MinScaleDenominator>201</MinScaleDenominator>'+
        "<Filter>[TYP] = 'obecny_urad'</Filter>" +
        '<MarkersSymbolizer file= "./znacky/urad.png" width="30" height="30"  />'+
    '</Rule>' +
    '<Rule>' +
        '<MaxScaleDenominator>200</MaxScaleDenominator>' +
        '<MinScaleDenominator>0.1</MinScaleDenominator>'+
        "<Filter>[TYP] = 'obecny_urad'</Filter>" +
        '<MarkersSymbolizer file= "./znacky/urad.png" width="70" height="70"  />'+
    '</Rule>' +       
    '</Style>' 

    var style_ine='<Style name="style_ine">' + // style for layer "style_odpad"
        '<Rule>' +
            '<MaxScaleDenominator>8000</MaxScaleDenominator>' +
            '<MinScaleDenominator>4001</MinScaleDenominator>'+
            "<Filter>[OBJEKT] = 'fontana'</Filter>" +
            '<MarkersSymbolizer file= "./znacky/fountain.png" width="15" height="15"  />'+
        '</Rule>' +
        '<Rule>' +
            '<MaxScaleDenominator>4000</MaxScaleDenominator>' +
            '<MinScaleDenominator>201</MinScaleDenominator>'+
            "<Filter>[OBJEKT] = 'fontana'</Filter>" +
            '<MarkersSymbolizer file= "./znacky/fountain.png" width="25" height="25"  />'+
        '</Rule>' +
        '<Rule>' +
            '<MaxScaleDenominator>200</MaxScaleDenominator>' +
            '<MinScaleDenominator>0.1</MinScaleDenominator>'+
            "<Filter>[OBJEKT] = 'fontana'</Filter>" +
            '<MarkersSymbolizer file= "./znacky/fountain.png" width="50" height="50"  />'+
        '</Rule>' +
    '</Style>' 
    ////Koniec štýlovania vrstiev

    var schema = '<Map background-color="transparent" srs="'+proj+'">' + //  definovanie farby alebo podkladového motívu pre pozadie mapy a projekčného systému pre vrstvy
                (addBudovy ? style_budovy : '') +  // Ternárny operátot, ktorý vraví že ak je splnená podmienka add**** definovana vyssie, tak sa vykoná style***** a ak nie tak sa nič nevykoná
                (addCesty ? style_cesty : '') + // detto
                (addChodniky ? style_chodniky : '') + //detto
                (addCintorin ? style_cintorin : '') + //detto
                (addLavicky ? style_lavicky : '') + //detto
                (addOdpad ? style_odpad : '') + //detto
                (addParkovisko ? style_parkovisko : '') + //detto
                (addSluzby ? style_sluzby : '') + //detto
                (addIne ? style_ine : '') + //detto

                    '<Layer name="cesty" srs="'+proj+'">' + // vrstve s názvom ***** je definovaná projekcia
                        '<StyleName>style_cesty</StyleName>' + // binding of a style used for this layer => "style_cesty"
                        '<Datasource>' + // definition of a data source
                            '<Parameter name="file">' + path.join( __dirname, 'vrstvy/cesty.shp' ) +'</Parameter>' + // path to the data file
                            '<Parameter name="type">shape</Parameter>' + // file type
                        '</Datasource>' +
                    '</Layer>' +

                    '<Layer name="chodniky" srs="'+proj+'">' + // layer "cesty" with spatial reference system
                        '<StyleName>style_chodniky</StyleName>' + // pridelenie vyššie definovaneho štýlu vrstvy style_*** k danej vrstve ***
                        '<Datasource>' + // definovanie zdroju dát
                            '<Parameter name="file">' + path.join( __dirname, 'vrstvy/chodniky.shp' ) +'</Parameter>' + // cesta k vrstve ****
                            '<Parameter name="type">shape</Parameter>' + // definovanie typu vrstvy (bodová, líniová alebo polygónová)
                        '</Datasource>' +
                    '</Layer>' +
                    
                    '<Layer name="budovy" srs="'+proj+'">' + // obdobne
                        '<StyleName>style_budovy</StyleName>' +
                            '<Datasource>' +
                                '<Parameter name="file">' + path.join( __dirname, 'vrstvy/budovy.shp' ) +'</Parameter>' +
                                '<Parameter name="type">shape</Parameter>' +
                            '</Datasource>' +
                    '</Layer>' +

                    '<Layer name="cintorin" srs="'+proj+'">' + // obdobne
                        '<StyleName>style_cintorin</StyleName>' + 
                        '<Datasource>' + 
                            '<Parameter name="file">' + path.join( __dirname, 'vrstvy/cintorin.shp' ) +'</Parameter>' + // path to the data file
                            '<Parameter name="type">shape</Parameter>' + 
                        '</Datasource>' +
                    '</Layer>' +

                    '<Layer name="parkovisko" srs="'+proj+'">' + // obdobne
                        '<StyleName>style_parkovisko</StyleName>' +
                        '<Datasource>' +
                            '<Parameter name="file">' + path.join( __dirname, 'vrstvy/parkovisko.shp' ) +'</Parameter>' +
                            '<Parameter name="type">shape</Parameter>' +
                        '</Datasource>' +
                    '</Layer>' + 

                    '<Layer name="lavicky" srs="'+proj+'">' + // obdobne
                        '<StyleName>style_lavicky</StyleName>' +
                        '<Datasource>' +
                            '<Parameter name="file">' + path.join( __dirname, 'vrstvy/lavicky.shp' ) +'</Parameter>' +
                            '<Parameter name="type">shape</Parameter>' +
                        '</Datasource>' +
                    '</Layer>' + 

                    '<Layer name="odpad" srs="'+proj+'">' + // obdobne
                        '<StyleName>style_odpad</StyleName>' +
                        '<Datasource>' +
                            '<Parameter name="file">' + path.join( __dirname, 'vrstvy/odpad.shp' ) +'</Parameter>' +
                            '<Parameter name="type">shape</Parameter>' +
                        '</Datasource>' +
                    '</Layer>' + 

                    '<Layer name="sluzby" srs="'+proj+'">' + // obdobne
                        '<StyleName>style_sluzby</StyleName>' +
                        '<Datasource>' +
                            '<Parameter name="file">' + path.join( __dirname, 'vrstvy/sluzby.shp' ) +'</Parameter>' +
                            '<Parameter name="type">shape</Parameter>' +
                        '</Datasource>' +
                    '</Layer>' + 


                    '<Layer name="ine" srs="'+proj+'">' + // obdobne
                        '<StyleName>style_ine</StyleName>' +
                        '<Datasource>' +
                            '<Parameter name="file">' + path.join( __dirname, 'vrstvy/Ine.shp' ) +'</Parameter>' +
                            '<Parameter name="type">shape</Parameter>' +
                        '</Datasource>' +
                    '</Layer>' + 

                '</Map>';
// týmto je definovaný mapník XML v premennej, ktorá definuje zobrazované vrstvy, dátové zdroje štýlovanie vrstiev
  
map.fromString(schema, function(err, map) { // vstavaná funkcia fromString nám umožní použiť XML schému definovanú ako číselné hodnoty v schéme premenných
  if (err) { // ak príkaz bude nevykonatelný
      console.log('Map Schema Error: ' + err.message) // Chybová hláška "Map Schema Error:" s uvedením zdroja vzniku chyby
  }
  map.zoomToBox(BBOX); // Zobrazí nášu mapu do ohradi definovanej v premennej BBOX

  var im = new mapnik.Image(width, height); // definovanie nového mapník obrázku s rovnakou šírkou a výškou ako naša mapa "map"

  map.render(im, function(err, im) { // renderuje premennú map do mapnika v ktorom je uloťená ako premenná "im"
      
    if (err) { // ak nastane chyba
        console.log('Map redner Error: ' + err.message) // vypíše zdroj chyby
    }

    im.encode("png", function(err, buffer) { // uloží náš obraz mapy definovaný v "im" do formátu "png"
      if (err) { // ak nastane chyba
         console.log('Encode Error: ' + err.message) // vypíše zdroj chyby
      }

      fs.writeFile( // použijeme node file system package "fs" na zápis do súboru, prvým parametrom je cesta k nášmu súboru
        path.join(__dirname, "out/map.png"), // skombinuje adresár v ktorom je skript spustený s požadovaným obrázkom mapy
        buffer, // vloží obrazový buffer vytvorený metódou "im.encode" obrazového mapníka
        function(err) { //funkcia ak nastane chyba
          if (err) { // ak je chyba
              console.log(' Fs Write Error: ' + err.message) // vypíše chybu v definovaní premennej "fs"
          }
          console.log('Image generated into: ' + // v opačnóm prípade vypíše hlášku ......
            path.join(__dirname, "out/map.png") // definujeme cestu k súboru kam sa vyygenerovaný obraz mapy uloží vo formáte "png"
            // po správe "Image generated into..." je obraz uložený v priečinku out
          );
          sendFile(path.join(__dirname ,"out/map.png")); // cesta k vygenerovanemu obrazu mapy bude odoslana (serveru)
        }
      );
    });
  });
})
};


module.exports = ImageCreator; //definovanie modula, ktorý bude importovaný do skriptu servera