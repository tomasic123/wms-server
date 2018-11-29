var path = require("path");
var fs = require("fs");
var mapnik = require("mapnik"); // lib for map rendering

mapnik.register_default_fonts(); // register some default fonts into mapnik
mapnik.register_default_input_plugins(); // same with plugins

function ImageCreator(arg, sendFile){
    var width = Number(arg.WIDTH); // with of map image in pixels
    var height = Number(arg.HEIGHT); // height -||-
    var BBOX = arg.BBOX.split(',').map(function(elem){
        return Number(elem)}); // bottom left corner coords and top right corner coords of the image 
    var layers=(arg.LAYERS).split(',');

    var map = new mapnik.Map(width, height);
// create new map object with defined width and height

    var addBudovy=arg.LAYERS.includes('budovy'); // či obsahuje
    var addCesty=arg.LAYERS.includes('cesty');
    var addChodniky=arg.LAYERS.includes('chodniky');
    var addCintorin=arg.LAYERS.includes('cintorin');
    var addLavicky=arg.LAYERS.includes('lavicky');
    var addOdpad=arg.LAYERS.includes('odpad');
    var addParkovisko=arg.LAYERS.includes('parkovisko');
    var addSluzby=arg.LAYERS.includes('sluzby');
    var addIne=arg.LAYERS.includes('ine');


    var proj = "+proj=krovak +lat_0=49.5 +lon_0=24.83333333333333 +alpha=30.28813972222222 +k=0.9999 +x_0=0 +y_0=0 +ellps=bessel +towgs84=589,76,480,0,0,0,0 +units=m +no_defs";

    var style_budovy='<Style name="style_budovy">' + // style for layer "style_budovy"
        '<Rule>' +
            '<PolygonSymbolizer fill="#ff6d6d"  />' + // style for polygons
            '<LineSymbolizer stroke="black" stroke-width="0.1" />' + // style for lines
        '</Rule>' +
    '</Style>' 

    var style_cesty='<Style name="style_cesty">' + // style for layer "style_cesty"
        '<Rule>' +
            '<MinScaleDenominator>8001</MinScaleDenominator>'+
            '<LineSymbolizer stroke="black" stroke-width="1"/>' + // style for lines
        '</Rule>' +
        '<Rule>' +
            '<MaxScaleDenominator>8000</MaxScaleDenominator>'+
            '<MinScaleDenominator>3001</MinScaleDenominator>'+
            '<LineSymbolizer stroke="#99897e" stroke-width="5" stroke-linecap="round" />' + // style for lines
        '</Rule>' +
        '<Rule>' +
            '<MaxScaleDenominator>8000</MaxScaleDenominator>'+
            '<MinScaleDenominator>3001</MinScaleDenominator>'+
            '<LineSymbolizer stroke="black" stroke-width="1" stroke-dasharray="4 2" />' + // style for lines
        '</Rule>' +
        '<Rule>' +
            '<MaxScaleDenominator>8000</MaxScaleDenominator>'+
            '<MinScaleDenominator>3001</MinScaleDenominator>'+
            '<LineSymbolizer stroke="black" stroke-width="1" offset="3" />' + // style for lines
        '</Rule>' +
        '<Rule>' +
            '<MaxScaleDenominator>8000</MaxScaleDenominator>'+
            '<MinScaleDenominator>3001</MinScaleDenominator>'+
            '<LineSymbolizer stroke="black" stroke-width="1" offset="-3" />' + // style for lines
        '</Rule>' +

        '<Rule>' +
            '<MaxScaleDenominator>3000</MaxScaleDenominator>'+
            '<MinScaleDenominator>200</MinScaleDenominator>'+
            '<LineSymbolizer stroke="#99897e" stroke-width="8" stroke-linecap="round"/>' + // style for lines
        '</Rule>' +
        '<Rule>' +
            '<MaxScaleDenominator>3000</MaxScaleDenominator>'+
            '<MinScaleDenominator>200</MinScaleDenominator>'+
            '<LineSymbolizer stroke="black" stroke-width="2" stroke-dasharray="4 2" />' + // style for lines
        '</Rule>' +
        '<Rule>' +
            '<MaxScaleDenominator>3000</MaxScaleDenominator>'+
            '<MinScaleDenominator>200</MinScaleDenominator>'+
            '<LineSymbolizer stroke="black" stroke-width="1" offset="4" />' + // style for lines
        '</Rule>' +
        '<Rule>' +
            '<MaxScaleDenominator>3000</MaxScaleDenominator>'+
            '<MinScaleDenominator>200</MinScaleDenominator>'+
            '<LineSymbolizer stroke="black" stroke-width="1" offset="-4" />' + // style for lines
        '</Rule>' +
        
        '<Rule>' +
            '<MaxScaleDenominator>199</MaxScaleDenominator>'+
            '<MinScaleDenominator>1</MinScaleDenominator>'+
            '<LineSymbolizer stroke="#99897e" stroke-width="80" stroke-linecap="round"/>' + // style for lines
        '</Rule>' +
        '<Rule>' +
            '<MaxScaleDenominator>199</MaxScaleDenominator>'+
            '<MinScaleDenominator>1</MinScaleDenominator>'+
            '<LineSymbolizer stroke="black" stroke-width="5" stroke-dasharray="20 5" />' + // style for lines
        '</Rule>' +
        '<Rule>' +
            '<MaxScaleDenominator>199</MaxScaleDenominator>'+
            '<MinScaleDenominator>1</MinScaleDenominator>'+
            '<LineSymbolizer stroke="black" stroke-width="3" offset="40" />' + // style for lines
        '</Rule>' +
        '<Rule>' +
            '<MaxScaleDenominator>199</MaxScaleDenominator>'+
            '<MinScaleDenominator>1</MinScaleDenominator>'+
            '<LineSymbolizer stroke="black" stroke-width="3" offset="-40" />' + // style for lines
        '</Rule>' +           
    '</Style>'

    var style_chodniky='<Style name="style_chodniky">' + // style for layer "style_cesty"       
        '<Rule>' +
            '<MaxScaleDenominator>3000</MaxScaleDenominator>'+
            '<MinScaleDenominator>200</MinScaleDenominator>'+
            '<LineSymbolizer stroke="#8c400b" stroke-width="3" />' + // style for lines
        '</Rule>' +
        '<Rule>' +
            '<MaxScaleDenominator>3000</MaxScaleDenominator>'+
            '<MinScaleDenominator>200</MinScaleDenominator>'+
            '<LineSymbolizer stroke="#61ff23" stroke-width="3"  stroke-dasharray="4, 2"/>' + // style for lines
        '</Rule>' +
        '<Rule>' +
            '<MaxScaleDenominator>3000</MaxScaleDenominator>'+
            '<MinScaleDenominator>200</MinScaleDenominator>'+
            '<LineSymbolizer stroke="black" stroke-width="0.5" offset="1.5" />' + // style for lines
        '</Rule>' +
        '<Rule>' +
            '<MaxScaleDenominator>3000</MaxScaleDenominator>'+
            '<MinScaleDenominator>200</MinScaleDenominator>'+
            '<LineSymbolizer stroke="black" stroke-width="0.5" offset="-1.5" />' + // style for lines
        '</Rule>' +
        
        '<Rule>' +
            '<MaxScaleDenominator>199</MaxScaleDenominator>'+
            '<MinScaleDenominator>1</MinScaleDenominator>'+
            '<LineSymbolizer stroke="#8c400b" stroke-width="5" />' + // style for lines
        '</Rule>' +
        '<Rule>' +
            '<MaxScaleDenominator>199</MaxScaleDenominator>'+
            '<MinScaleDenominator>1</MinScaleDenominator>'+
            '<LineSymbolizer stroke="#61ff23" stroke-width="5"  stroke-dasharray="4, 2"/>' + // style for lines
        '</Rule>' +
        '<Rule>' +
            '<MaxScaleDenominator>199</MaxScaleDenominator>'+
            '<MinScaleDenominator>1</MinScaleDenominator>'+
            '<LineSymbolizer stroke="black" stroke-width="1" offset="2.5" />' + // style for lines
        '</Rule>' +
        '<Rule>' +
            '<MaxScaleDenominator>199</MaxScaleDenominator>'+
            '<MinScaleDenominator>1</MinScaleDenominator>'+
            '<LineSymbolizer stroke="black" stroke-width="1" offset="-2.5" />' + // style for lines
        '</Rule>' + 
    '</Style>'
    
    var style_cintorin='<Style name="style_cintorin">' + // style for layer "style_budovy"
        '<Rule>' +
            '<LineSymbolizer stroke="black" stroke-width="0.1" />' + // style for lines
            '<PolygonSymbolizer fill="#633977"  />' + // style for polygons
        '</Rule>' +
        '<Rule>'+
            '<MaxScaleDenominator>8000</MaxScaleDenominator>'+
            '<MinScaleDenominator>3001</MinScaleDenominator>'+
            '<PolygonPatternSymbolizer file="./znacky/cross1.png"/>'+
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

    var style_lavicky='<Style name="style_lavicky">' + // style for layer "style_lavicky"
        '<Rule>' +
            '<MaxScaleDenominator>2000</MaxScaleDenominator>' +
            '<MinScaleDenominator>200</MinScaleDenominator>'+
            '<PointSymbolizer file= "./znacky/bench.png" transform="scale(0.05,0.05)" />'+
            '</Rule>' +
            '<Rule>' +
                '<MaxScaleDenominator>199</MaxScaleDenominator>' +
                '<MinScaleDenominator>1</MinScaleDenominator>'+
                '<PointSymbolizer file= "./znacky/bench.png" transform="scale(0.1,0.1)" />'+
            '</Rule>' +
    '</Style>'

    var style_odpad='<Style name="style_odpad">' + // style for layer "style_odpad"
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
    
    var style_parkovisko='<Style name="style_parkovisko">' + // style for layer "style_odpad"
        '<Rule>' +
            '<PolygonSymbolizer fill="#00fffa"  stroke-opacity="0.1" />' + // style for polygons
            '<LineSymbolizer stroke="black" stroke-width="0.5" />' + // style for lines
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

    var style_sluzby='<Style name="style_sluzby">' + // style for layer "style_odpad"
        '<Rule>' +
            '<MaxScaleDenominator>8000</MaxScaleDenominator>' +
            '<MinScaleDenominator>4001</MinScaleDenominator>'+
            "<Filter>[TYP] = 'posta'</Filter>" +
            '<MarkersSymbolizer file= "./znacky/post.png" width="15" height="15"  />'+
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

    var schema = '<Map background-color="transparent" srs="'+proj+'">' + // we define background color of the map and its spatial reference system with epsg code of data used
                (addBudovy ? style_budovy : '') +
                (addCesty ? style_cesty : '') +
                (addChodniky ? style_chodniky : '') +
                (addCintorin ? style_cintorin : '') +
                (addLavicky ? style_lavicky : '') +
                (addOdpad ? style_odpad : '') +
                (addParkovisko ? style_parkovisko : '') +
                (addSluzby ? style_sluzby : '') +
                (addIne ? style_ine : '') +

                    '<Layer name="cesty" srs="'+proj+'">' + // layer "cesty" with spatial reference system
                        '<StyleName>style_cesty</StyleName>' + // binding of a style used for this layer => "style_cesty"
                        '<Datasource>' + // definition of a data source
                            '<Parameter name="file">' + path.join( __dirname, 'vrstvy/cesty.shp' ) +'</Parameter>' + // path to the data file
                            '<Parameter name="type">shape</Parameter>' + // file type
                        '</Datasource>' +
                    '</Layer>' +

                    '<Layer name="chodniky" srs="'+proj+'">' + // layer "cesty" with spatial reference system
                        '<StyleName>style_chodniky</StyleName>' + // binding of a style used for this layer => "style_cesty"
                        '<Datasource>' + // definition of a data source
                            '<Parameter name="file">' + path.join( __dirname, 'vrstvy/chodniky.shp' ) +'</Parameter>' + // path to the data file
                            '<Parameter name="type">shape</Parameter>' + // file type
                        '</Datasource>' +
                    '</Layer>' +
                    
                    '<Layer name="budovy" srs="'+proj+'">' + // same as above
                        '<StyleName>style_budovy</StyleName>' +
                            '<Datasource>' +
                                '<Parameter name="file">' + path.join( __dirname, 'vrstvy/budovy.shp' ) +'</Parameter>' +
                                '<Parameter name="type">shape</Parameter>' +
                            '</Datasource>' +
                    '</Layer>' +

                    '<Layer name="cintorin" srs="'+proj+'">' + // layer "cesty" with spatial reference system
                        '<StyleName>style_cintorin</StyleName>' + // binding of a style used for this layer => "style_cesty"
                        '<Datasource>' + // definition of a data source
                            '<Parameter name="file">' + path.join( __dirname, 'vrstvy/cintorin.shp' ) +'</Parameter>' + // path to the data file
                            '<Parameter name="type">shape</Parameter>' + // file type
                        '</Datasource>' +
                    '</Layer>' +

                    '<Layer name="parkovisko" srs="'+proj+'">' + // same as above
                        '<StyleName>style_parkovisko</StyleName>' +
                        '<Datasource>' +
                            '<Parameter name="file">' + path.join( __dirname, 'vrstvy/parkovisko.shp' ) +'</Parameter>' +
                            '<Parameter name="type">shape</Parameter>' +
                        '</Datasource>' +
                    '</Layer>' + 

                    '<Layer name="lavicky" srs="'+proj+'">' + // same as above
                        '<StyleName>style_lavicky</StyleName>' +
                        '<Datasource>' +
                            '<Parameter name="file">' + path.join( __dirname, 'vrstvy/lavicky.shp' ) +'</Parameter>' +
                            '<Parameter name="type">shape</Parameter>' +
                        '</Datasource>' +
                    '</Layer>' + 

                    '<Layer name="odpad" srs="'+proj+'">' + // same as above
                        '<StyleName>style_odpad</StyleName>' +
                        '<Datasource>' +
                            '<Parameter name="file">' + path.join( __dirname, 'vrstvy/odpad.shp' ) +'</Parameter>' +
                            '<Parameter name="type">shape</Parameter>' +
                        '</Datasource>' +
                    '</Layer>' + 

                    '<Layer name="sluzby" srs="'+proj+'">' + // same as above
                        '<StyleName>style_sluzby</StyleName>' +
                        '<Datasource>' +
                            '<Parameter name="file">' + path.join( __dirname, 'vrstvy/sluzby.shp' ) +'</Parameter>' +
                            '<Parameter name="type">shape</Parameter>' +
                        '</Datasource>' +
                    '</Layer>' + 


                    '<Layer name="ine" srs="'+proj+'">' + // same as above
                        '<StyleName>style_ine</StyleName>' +
                        '<Datasource>' +
                            '<Parameter name="file">' + path.join( __dirname, 'vrstvy/Ine.shp' ) +'</Parameter>' +
                            '<Parameter name="type">shape</Parameter>' +
                        '</Datasource>' +
                    '</Layer>' + 

                '</Map>';
// now we have a mapnik xml in variable schema that defines layers, data sources and styles of the layers

  map.fromString(schema, function(err, map) { // we use method "fromString" => we need to use the xml schema inside variable schema
  if (err) {
      console.log('Map Schema Error: ' + err.message) // if there is an error in schema processing we print it out
  }
  map.zoomToBox(BBOX); // let's zoom our mapnik map to bounding box stored in BBOX variable

  var im = new mapnik.Image(width, height); // we define new mapnik image with the same width and height as our map

  map.render(im, function(err, im) { // render the map into mapnik image stored in variable "im"
      
    if (err) {
        console.log('Map redner Error: ' + err.message) // print an error if it occures
    }

    im.encode("png", function(err, buffer) { // encoude our image into "png"
      if (err) {
         console.log('Encode Error: ' + err.message) // same same
      }

      fs.writeFile( // we ouse node file system package "fs" to write into file, first parameter is path to our file
        path.join(__dirname, "out/map.png"), // combine directory of our running script and desired map image
        buffer, // insert the image buffer created by "im.encode" method of mapnik image
        function(err) {
          if (err) {
              console.log(' Fs Write Error: ' + err.message) // same same
          }
          console.log('Image generated into: ' + 
            path.join(__dirname, "out/map.png") // we print our path to created image when the image is all writen into "map.png"
            // after the "Image generated into..." message is out, we can open our generated image
            // change the bounding box, width, height and style if you want
          );
          sendFile(path.join(__dirname ,"out/map.png"));
        }
      );
    });
  });
})
};


module.exports = ImageCreator;