
$(function(){

/**
 * jQuery.browser.mobile (http://detectmobilebrowser.com/)
 * jQuery.browser.mobile will be true if the browser is a mobile device
 **/
(function(a){(jQuery.browser=jQuery.browser||{}).mobile=/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4))})(navigator.userAgent||navigator.vendor||window.opera);

	var map;
   var vectorLayer;
   var loadData;
   
   var dataSet="2";
   var mapFitted = false;
   var mapCenterX = 18;
   var mapCenterY = 60;
   var mapZoom = 10;
   
   if (!String.prototype.startsWith) {
      String.prototype.startsWith = function(searchString, position) {
         position = position || 0;
         return this.indexOf(searchString, position) === position;
      };
   }   
   
   if (window.location.hash !== '') {
      var hash = window.location.hash.replace('#=', '');
      var params={};
      var splits = hash.split('&');
      $.each(splits, function(idx, param) {
         var explosion = param.split('=');
         var key = decodeURIComponent(explosion[0]);
         var value=decodeURIComponent(explosion[1]);
         params[key] = value;
      });
      dataSet = params.dataSet || dataSet;
      mapCenterX = params.x;
      mapCenterY = params.y;
      mapZoom = params.z || mapZoom;
      if(params.x) mapFitted = true
   }   

   function updateLinkState() {
      var zoom = view.getZoom();
      var center = view.getCenter();
      center = ol.proj.transform(center, 'EPSG:900913', 'EPSG:3006')
      var x = Math.round(center[0]*100)/100;
      var y = Math.round(center[1]*100)/100;
      
      var obj={
         dataSet:dataSet,
      };
      if(x) obj.x = x;
      if(y) obj.y = y;
      if(zoom) obj.z = zoom;

      var hash = "#=" + $.param(obj);
      history.replaceState(null, '', hash);
   }   
  
   var pathNameExplosion = window.location.pathname.split('/')
   var area = pathNameExplosion[pathNameExplosion.length - 1];

   var fitMapOnFirstLoad = function(e){
       if(mapFitted) return;
      mapFitted = true
      function fitMapToExtent(extent){
         map.getView().fit(extent, map.getSize());
      }
      fitMapToExtent(vectorLayer.getSource().getExtent())
      // If we change dataset, there might be a first load for many sources
      // But we dont want to reposition in all those cases.
      // So do this to disable any beyond the first repositioning.
      fitMapOnFirstLoad = function(){}
   }
   
   var wmsAvverkning = new ol.source.TileWMS({
     url: 'http://geodpags.skogsstyrelsen.se/arcgis/services/Geodataportal/GeodataportalVisaAvverkningsanmalan/MapServer/WmsServer?',
     params: {'LAYERS': 'Avverkningsanmalan_Skogsstyrelsen'}
   });
   
   function jsonStartLoad(which) {
      $('#loading-indicator-' + which).show();
      $('#loading-indicator').show();
   }

   function jsonEndLoad(which) {
      $('#loading-indicator-' + which).hide();
      var indicator = $('#loading-indicator');
      var children = indicator.find('.loading-indicator-entry:visible');
      var allHidden = children.length == 0;
      if(allHidden) {
         indicator.hide();
      }
   }
   
   

   loadData = function(dataSetName) {
      jsonStartLoad('avverk');
      dataSet = dataSetName;
      updateLinkState();
      var url = "/data/AvverkAnm/sksAvverkAnm" + area + "/" + dataSetName + ".json";

      map.removeLayer(vectorLayer);

      var vectorSource = new ol.source.Vector({
         url: url,
         format: geoJSONFormat,
      })
      vectorSource.once('change', fitMapOnFirstLoad);
      vectorSource.once('change', function() {
         jsonEndLoad('avverk');
      });
         
      vectorLayer = new ol.layer.Vector({
         title: 'added Layer',
         source: vectorSource,
         style: styleFunction,
      })
      map.addLayer(vectorLayer);
      vectorLayer.wmsSource = wmsAvverkning;
      }

   
   
   window.app = {};
   var app = window.app;
   app.SelectControl = function(opt_options) {
      var options = opt_options || {};
      
      var optionTexts = options.optionTexts || []; // [ "Howdy", "there" ]
      var select = $('<select>');
      this.select = select;
      
      $.each(optionTexts, function(index, text) {
         select.append($("<option>").attr('value', index).text(text))
      });
      
      var this_ = this;
      
      var element = $('<div>').addClass('ol-unselectable').addClass('ol-control');
      var className = options.className || 'select-control';
      element.addClass(className)
      element.append(select);
      
      ol.control.Control.call(this, {
         element: element.get(0),
         target: options.target
      });
   
   };
   ol.inherits(app.SelectControl, ol.control.Control);
   
   app.IconButtonControl = function(opt_options) {
      var options = opt_options || {};
      
      var iconUrl = options.iconUrl || "";
      var icon = $('<input>');
      icon.attr("type","image");
      icon.attr("src",iconUrl);
      this.icon = icon;      
            
      var this_ = this;
      
      var element = $('<div>').addClass('ol-unselectable').addClass('ol-control');
      var className = options.className || 'iconbutton-control';
      element.addClass(className)
      element.append(icon);
      
      ol.control.Control.call(this, {
         element: element.get(0),
         target: options.target
      });
   
   };
   ol.inherits(app.IconButtonControl, ol.control.Control);

   var olMapDiv = document.getElementById('olmap');
   var stylesZoom0 = {
      'Polygon': [new ol.style.Style({
         stroke: new ol.style.Stroke({
            color: 'rgba(51, 153, 204, 0.8)',
            //lineDash: [4],
            width: 1.25
         }),
         fill: new ol.style.Fill({
            color: 'rgba(51, 153, 204, 0.4)'
         })
      })],
   };
   var stylesZoom15 = {
      'Polygon': [new ol.style.Style({
         stroke: new ol.style.Stroke({
            color: 'rgba(51, 153, 204, 1.0)',
            //lineDash: [4],
            width: 1.25
         }),
         fill: new ol.style.Fill({
            color: 'rgba(51, 153, 204, 0.0)'
         })
      })],
   };
   var stylesInvisible = {
      'Polygon': [new ol.style.Style({
         stroke: new ol.style.Stroke({
            color: 'rgba(255, 204, 203, 0.0)',
            //lineDash: [4],
            width: 1.25
         }),
         fill: new ol.style.Fill({
            color: 'rgba(255, 204, 203, 0.0)'
         })
      })],
   };
   
   proj4.defs("EPSG:3006", "+proj=utm +zone=33 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs");
   var projection = ol.proj.get('EPSG:3006');
   projection.setExtent([-1200000.000000, 4305696.000000, 2994304.000000, 8500000.000000])

   var geoJSONFormat = new ol.format.GeoJSON({
     defaultDataProjection: 'EPSG:3006'
   })
   
      
      
      
//      var wms = new OpenLayers.Layer.WMS(
//  "OpenLayers WMS",
//  "http://geodpags.skogsstyrelsen.se/arcgis/services/Geodataportal/GeodataportalVisaBiotopskydd/MapServer/WmsServer?",
//  {'layers':'basic'} );
//map.addLayer(wms);


   var bingLayers = {
      Road: 'Road',
      Aerial: 'Aerial',
      AerialWithLabels: 'AerialWithLabels',
   };
   
   var bingMapKeyDev = 'AnQQot25olSeUKZTqYCtyMIvdchRs64lY4KM2qmA-5iDOR8oTTdP2so1O6eS-J_U';
   var bingMapKey = 'AuJV31sPXuXHRlVALiWiPsEDLU_juF3zEWM1Wa2b_QqfbPzX0OuOPjVccGcWzqXo'
   
   var bingMapLayer = new ol.layer.Tile({
    //visible: false,
    preload: Infinity,
    name:'BingAerial',
    source: new ol.source.BingMaps({
      key: bingMapKeyDev,
      imagerySet: bingLayers.AerialWithLabels,
      // use maxZoom 19 to see stretched tiles instead of the BingMaps
      // "no photos at this zoom level" tiles
      maxZoom: 19
    })
  });
  
  var gmap;
  var googleHackLayer
  if(window.google){
      gmap = new google.maps.Map(document.getElementById('gmap'), {
      disableDefaultUI: true,
      keyboardShortcuts: false,
      draggable: false,
      disableDoubleClickZoom: true,
      scrollwheel: false,
      streetViewControl: false
    });
    gmap.setMapTypeId(google.maps.MapTypeId.HYBRID);	  
  }

    
   var view = new ol.View({
       center: ol.proj.transform([mapCenterX, mapCenterY], 'EPSG:3006', 'EPSG:900913'),
      //center: [0, 0],
      zoom: mapZoom,
      maxZoom:19
   });
   
   var styleFunction = function(feature, resolution) {
      // resolution is not zoom. Is it meters per pizel or something?
      var zoom = view.getZoom();
      var type = feature.getGeometry().getType();
      var zoomStyle = zoom >= 15 ? stylesZoom15 : stylesZoom0;
      return zoomStyle[type];
   };   
   if(gmap){
	   googleHackLayer = {
		  name:'Google',
		  enableGoogleSync:true,
		  get:function(key) { return this[key]; },
		  setVisible:function(value) {
			 this.enableGoogleSync = value;
			 var val = value ? 'visible' : 'hidden';
			 var a = $('#gmap');
			 a.css('visibility', val);
			 this.updateCenter();
			 this.updateZoom();
		  },
		  updateCenter:function() {
			 if(!googleHackLayer.enableGoogleSync) return;
			 var center = ol.proj.transform(view.getCenter(), 'EPSG:3857', 'EPSG:4326');
			 gmap.setCenter(new google.maps.LatLng(center[1], center[0]));
		  },
		  updateZoom:function() {
			 if(!googleHackLayer.enableGoogleSync) return;
			 gmap.setZoom(view.getZoom());
		  },
	   };
	   view.on('change:center', googleHackLayer.updateCenter);
	   view.on('change:resolution', googleHackLayer.updateZoom);
   }
         
   var layerOSM = new ol.layer.Tile({
       source: new ol.source.OSM(),
       name: 'OpenStreetMap'
   });
   
   var layerMQOSM = new ol.layer.Tile({
       source: new ol.source.MapQuest({
           layer: 'osm'
       }),
       name: 'MapQuest OSM'
   });
   
   var layerMQSat = new ol.layer.Tile({
      source: new ol.source.MapQuest({layer: 'sat'}),
      name: 'MapQuest SAT'
    })
    
   var layerTerrang = new ol.layer.Tile({
      name: 'Terrängkartan'
   })
 
	
   var baseLayerList = [];
   if(gmap){
      baseLayerList = baseLayerList.concat([googleHackLayer])
   }
   baseLayerList = baseLayerList.concat([
      bingMapLayer,
      layerTerrang,
      layerOSM,
      layerMQOSM,
      layerMQSat,
   ]);

   var selectBaseLayer = new app.SelectControl({
      optionTexts:$.map(baseLayerList, function(layer, index) { return layer.get('name'); }),
      className:'select-baselayer',
   });
   selectBaseLayer.select.change(function() {
      var value = selectBaseLayer.select.val();
      for(var i=0,ii=baseLayerList.length; i < ii; ++i) {
         baseLayerList[i].setVisible(i == value);
      }
   });

   var dataSets=[];
	function addDataSet(setName, displayName) {
      var url = '/show/' + area + '/' + setName;
		dataSets.push({
         setName:setName,
         url:url,
         displayName:displayName,
         load:function(){
            loadData(setName);
         },
      });
	}
	
	addDataSet("2", "2 veckor");
	addDataSet("3", "3 veckor");
	addDataSet("6", "6 veckor");
	addDataSet("52", "1 år");
	addDataSet("260", "5 år");
      
   var selectDataSet = new app.SelectControl({
      optionTexts:$.map(dataSets, function(dataSet) { return dataSet.displayName; }),
      className:'select-dataSet',
   });

   selectDataSet.select.change(function() {
      var value = selectDataSet.select.val();
      dataSets[value].load();
   });
   
   /* Legend */
   
   var legendDiv = $("#legend");
   var legendList = legendDiv.children("#legend-list");
   var legendCloser = legendDiv.children("#legend-closer");
   legendCloser.click(function() {
      legendDiv.toggle(100);
   });

   var iconDisplayLegend = new app.IconButtonControl({
      iconUrl:'/iconLegend.png',
      className:'legend-control',
   });
   $(iconDisplayLegend.element).click( function() {
      legendDiv.toggle(100);         
   })

   setTimeout(function() {
      var pos = $(iconDisplayLegend.element).offset();
      pos.left = pos.left + 25;
      legendDiv.offset(pos);
      legendDiv.show();
   }, 1000);
   
   
   function addLegendStyle(legendKey, colorOutline, colorFill) {
      if(!colorFill)
      {
         var style = colorOutline;
         var poly = style['Polygon'];
         var first = poly[0];
         var stroke = first.getStroke();
         var fill = first.getFill();
         colorOutline = stroke.getColor();
         colorFill = fill.getColor();
      }
      legendKey.css({ 'border-color': colorOutline, 'border-width':'2px', 'border-style':'solid', 'background-color': colorFill});
   }
    function addLegendImage(legendKey, url) {
        var img = $('<img>'); //Equivalent: $(document.createElement('img'))
        img.attr('src', url);
        img.appendTo(legendKey);       
    }
   function addLegend(displayName, a, b) {
      var row = $('<li>').addClass('legend-list-item');
      var legendKey = $('<div>').addClass('legend-key');
      var legendName=$('<span>');
      legendName.text(displayName);
      row.append(legendKey);
      row.append(displayName);
      legendList.append(row);       

       if(typeof(a) == "string" && a.startsWith("http://")) {
           addLegendImage(legendKey, a);           
       }
       else {
           addLegendStyle(legendKey, a, b);
       }
   }
   
   addLegend('Avverkningsanmälan', stylesZoom0);
   
   /* End legend */
   

   /* Metadata */
   
   var metaOverlay;
   var metaPopup = $('#meta-popup');
   var metaCloser = $('#meta-closer');
   var metaContent = $('#meta-content');
   metaCloser.click(function() {
      metaOverlay.setPosition(undefined);
      metaCloser.blur();
   });
   
   metaOverlay = new ol.Overlay({
      element: metaPopup.get(0),
      //autoPan : true,
      stopEvent : !jQuery.browser.mobile,
      autoPanAnimation : { duration : 250},
      positioning: 'center-right',
      
   });
   
   

   
   var metadataShort = $('#meta-short');
   function isDisplayable(x){
      return (typeof x == 'number') || (typeof x == 'string')
   }
   function setMetadata(attributes, coordinate) {
      metadataShort.empty();
      if(!attributes) {
         metadataShort.hide(100);
         return;
      }
      //metadataShort.show(50);
      var headings = [];
      var datas = [];
      $.each(attributes, function(key, value) {
         if(!isDisplayable(value)) return;
         if(!value.length) return;
         if(value == "Null" ||
            value == "saknas") return;
         if(key.startsWith("Shape.ST") || key == "Shape") return;
         if(typeof value == 'string' && (value.startsWith("http://") || value.startsWith("https://"))) {
            value = $('<a>').attr('href', value).attr('target', 'blank').append('[Info]');
         }
         headings.push(key);
         datas.push(value);
      });
      
      function horizontalTable(headings, data) {
         var headingItems = $.map(headings, function(headingText) {
            return $('<th>').text(headingText);
         });
         var headingRow = $('<tr>').append(headingItems);
         var dataItems = $.map(data, function(data) {
            return $('<td>').append(data);
         });
         var dataRow = $('<tr>').append(dataItems);
         return $('<table>').append(headingRow, dataRow);
      }

      var table = horizontalTable(headings, datas);
      metadataShort.append(table);

      function verticalTable(headings, datas) {
         var rows = $.map(headings, function(heading, index) {
            var data = datas[index];
            return $('<tr>').append(
               $('<th>').append(heading),
               $('<td>').append(data));
         });
         return $('<table>').append(rows);
      };
      table = verticalTable(headings, datas);
      metaContent.empty();
      metaContent.append(table);
      metaOverlay.setPosition(coordinate);
   }
   
   function updateFeature(originalFeature, newFeature) {
      if(newFeature.geometry) originalFeature.setGeometry(newFeature.geometry);
      if(newFeature.properties) originalFeature.setProperties(newFeature.properties);
      originalFeature.isUpdated = true;
   }
   
   function selectVectorFeature(selectedFeature, layer, coordinate) {
      var attributes = selectedFeature && selectedFeature.getProperties();
      var isUpdated = selectedFeature && selectedFeature.isUpdated
      if(!isUpdated && layer && layer.wmsSource && layer.wmsSource.getGetFeatureInfoUrl){
         var source = layer.wmsSource;
         var featureUrl = source.getGetFeatureInfoUrl(
            coordinate, view.getResolution(),
            'EPSG:3857', {'INFO_FORMAT':'application/geojson'});
         featureUrl = encodeURIComponent(featureUrl);
         var url = '/proxy/?url=' + featureUrl;
         $.getJSON(url, function(data) {
            var feature = data.features[0];
            setMetadata(feature.properties, coordinate);
            updateFeature(selectedFeature, feature)
         }).fail(function(err){
            console.log("Error");
            console.log(err);
         });
         return;
      }
      setMetadata(attributes, coordinate);       
   }
   
    function selectWmsFeature(pixel, coordinate) {

        map.getLayers().forEach(function(layer) {
            if(!layer.getSource().getGetFeatureInfoUrl) return;
            var source = layer.getSource();
            var featureUrl = source.getGetFeatureInfoUrl(
            coordinate, view.getResolution(),
            'EPSG:3857', {'INFO_FORMAT':'application/geojson'});
            featureUrl = encodeURIComponent(featureUrl);
            var url = '/proxy/?url=' + featureUrl;
            $.getJSON(url, function(data) {
                if(data.features.length == 0) return;
                var feature = data.features[0];
                setMetadata(feature.properties, coordinate);
            }).fail(function(err){
                console.log("Error");
                console.log(err);
            });
        })
    }
   
   function grabFeatureForMetadata(event) {
      var pixel = event.pixel;
      var layer;
      var selectedFeature = map.forEachFeatureAtPixel(pixel, function(feature, _layer) {
         if(_layer.ignoreHitDetection == true) return;
         layer = _layer;
         return feature;
      });
      setMetadata(null, event.coordinate);       
      if(selectedFeature) {
          selectVectorFeature(selectedFeature, layer, event.coordinate);
      }
      else {
          selectWmsFeature(pixel, event.coordinate);
      }
   }
   
   /* End metadata*/
   
   var controls = ol.control.defaults({
      attributionOptions: ({
         collapsible: true
      })
   }).extend([
      selectBaseLayer,
      selectDataSet,
      iconDisplayLegend,
   ]);
   
   var interactions = ol.interaction.defaults({
        altShiftDragRotate: false,
        pinchRotate:false,
        dragPan: false,
        rotate: false
   }).extend([new ol.interaction.DragPan({kinetic: null})])

   var map = new ol.Map({
     layers: [
        layerOSM,
        bingMapLayer,
        layerMQOSM,
        layerMQSat,
        layerTerrang,
     ],
     overlays: [ metaOverlay],
     target: olMapDiv,
     view: view,
     interactions: interactions,
     controls : controls,
   });

   $.get(('/proxy/?url=https%3A%2F%2Fapi.lantmateriet.se%2Fopen%2Ftopowebb-ccby%2Fv1%2Fwmts%2Ftoken%2Fa068b9a7e44a8c364a8b1b8fbb972cd%2F%3Frequest%3DGetCapabilities%26version%3D1.0.0%26service%3Dwmts'), function(response) {
      var contents = response;
      var parser = new ol.format.WMTSCapabilities();
      var result = parser.read(contents);

      var layerName = result.Contents.Layer[0].Identifier;
      var tmsName = result.Contents.Layer[0].TileMatrixSetLink[0].TileMatrixSet
      var TMS = null;
      for(index=0;index<result.Contents.TileMatrixSet.length;index++)
      {
         var val = result.Contents.TileMatrixSet[index];
         if(val.Identifier == tmsName) {
            TMS = val;
         }
      }

      var projectionExtent = projection.getExtent();
      var widthInMeters = ol.extent.getWidth(projectionExtent);
      var resolutions = [];
      var matrixIds = [];
      for (var z = 0; z < TMS.TileMatrix.length; ++z) {
         // generate resolutions and matrixIds arrays for this WMTS
         var pixelsAtLayer = TMS.TileMatrix[z].MatrixWidth * TMS.TileMatrix[z].TileWidth
         var size = widthInMeters / pixelsAtLayer;
         resolutions[z] = size;
         matrixIds[z] = z;
      }
      
      var terrangSource = new ol.source.WMTS({
         url: result.OperationsMetadata.GetTile.DCP.HTTP.Get[0].href,
         layer: layerName,
         matrixSet: tmsName,
         format: result.Contents.Layer[0].Format[0],
         projection: projection,
         tileGrid: new ol.tilegrid.WMTS({
            origin: ol.extent.getTopLeft(projectionExtent),
            extent: projectionExtent,
            resolutions: resolutions,
            matrixIds: matrixIds
         }),
         style: 'default',
         wrapX: true
      })

      layerTerrang.setMaxResolution(resolutions[0])
      layerTerrang.setSource(terrangSource)
   })
   
   map.on('click', grabFeatureForMetadata);
   
   //$.each(baseLayerList, function() { this.setVisible(false); });
   selectBaseLayer.select.val("0");
   selectBaseLayer.select.change();
   
   var dataSetIndex = $.inArray(dataSet, $.map(dataSets, function(dataSet) { return dataSet.setName; }));
   selectDataSet.select.val("" + dataSetIndex);
   selectDataSet.select.change();

   /* **Nyckelbiotoper** */      
   var stylesNyckelbiotoper = {
      'Polygon': [new ol.style.Style({
         stroke: new ol.style.Stroke({
            color: 'rgba(255, 0, 0, 0.8)',
            width: 1.75
         }),
         fill: new ol.style.Fill({
            color: 'rgba(50,205,50, 0.4)'
         })
      })],
   };
   addLegend('Nyckelbiotoper', stylesNyckelbiotoper);
   
   var styleFunctionNyckelbiotoper = function(feature, resolution) {
      // resolution is not zoom. Is it meters per pizel or something?
      var zoom = view.getZoom();
      var type = feature.getGeometry().getType();
      var zoomStyle = zoom >= 12 ? stylesNyckelbiotoper : stylesInvisible;
      return zoomStyle[type];
   };   
   jsonStartLoad('nyckelbiotoper');
   var vectorSourcesksNyckelbiotoper = new ol.source.Vector({
      url: "/data/Nyckelbiotoper/sksNyckelbiotoper" + area + "/0.json",
      format: geoJSONFormat,
   })
   vectorSourcesksNyckelbiotoper.once('change', function() {
      jsonEndLoad('nyckelbiotoper');
   });
   
   var vectorLayerNyckelbiotoper = new ol.layer.Vector({
       title: 'Nyckelbiotoper',
       source: vectorSourcesksNyckelbiotoper,
       style: styleFunctionNyckelbiotoper,
   })
   map.addLayer(vectorLayerNyckelbiotoper);
   view.on('change:resolution', function(){
      var zoom = view.getZoom();
      vectorLayerNyckelbiotoper.setVisible(zoom >= 12);
   });
   var wmsNyckelbiotoper = new ol.source.TileWMS({
     url: 'http://geodpags.skogsstyrelsen.se/arcgis/services/Geodataportal/GeodataportalVisaNyckelbiotop/MapServer/WmsServer?',
     params: {'LAYERS': 'Nyckelbiotop_Skogsstyrelsen'}
   });
   vectorLayerNyckelbiotoper.wmsSource = wmsNyckelbiotoper;



   var wmsBolagensNyckelbiotoperSource = new ol.source.TileWMS({
     url: 'http://geodpags.skogsstyrelsen.se/arcgis/services/Geodataportal/GeodataportalVisaSkogsbruknyckelbiotop/MapServer/WmsServer?',
     params: {'LAYERS': 'Storskogsbrukets_Nyckelbiotoper'}
   });
   var wmsBolagensNyckelbiotoper = new ol.layer.Tile({
          source: wmsBolagensNyckelbiotoperSource
    })
    map.addLayer(wmsBolagensNyckelbiotoper)
    wmsBolagensNyckelbiotoper.wmsSource = wmsBolagensNyckelbiotoperSource

    // Fix obtaining legend automatically. Do it in the future. Glorious future.
    addLegend('Bolagens Nyckelbiotoper', "http://geodpags.skogsstyrelsen.se/arcgis/services/Geodataportal/GeodataportalVisaSkogsbruknyckelbiotop/MapServer/WmsServer?request=GetLegendGraphic%26version=1.3.0%26format=image/png%26layer=Storskogsbrukets_Nyckelbiotoper");
   
   
   
   /* **Naturvärden** */      
   var stylesNaturvarden = {
      'Polygon': [new ol.style.Style({
         stroke: new ol.style.Stroke({
            color: '#FFA500',
            width: 1.25
         }),
         fill: new ol.style.Fill({
            color: 'rgba(50,205,50, 0.4)'
         })
      })],
   };
   addLegend('Naturvärden', stylesNaturvarden);
   
   
   var styleFunctionNaturvarden = function(feature, resolution) {
      // resolution is not zoom. Is it meters per pizel or something?
      var zoom = view.getZoom();
      var type = feature.getGeometry().getType();
      var zoomStyle = zoom >= 12 ? stylesNaturvarden : stylesInvisible;
      return zoomStyle[type];
   };   
   jsonStartLoad('naturvarden');
   var vectorSourcesksNaturvarden = new ol.source.Vector({
      url: "/data/Naturvarden/sksNaturvarden" + area + "/0.json",
      format: geoJSONFormat,
   });
   vectorSourcesksNaturvarden.once('change', function() {
      jsonEndLoad('naturvarden');
   });
   
   var vectorLayerNaturvarden = new ol.layer.Vector({
       title: 'Naturvarden',
       source: vectorSourcesksNaturvarden,
       style: styleFunctionNaturvarden,
   });
   map.addLayer(vectorLayerNaturvarden);
   view.on('change:resolution', function(){
      var zoom = view.getZoom();
      vectorLayerNaturvarden.setVisible(zoom >= 12);
      
   });
   var wmsNaturvarden = new ol.source.TileWMS({
     url: 'http://geodpags.skogsstyrelsen.se/arcgis/services/Geodataportal/GeodataportalVisaObjektnaturvarde/MapServer/WmsServer?',
     params: {'LAYERS': 'Objektnaturvarde_Skogsstyrelsen'}
   });
   vectorLayerNaturvarden.wmsSource = wmsNaturvarden;

   /* Geolocation */
   
   var geolocation = new ol.Geolocation({
      projection: view.getProjection(),
      trackingOptions: {
         enableHighAccuracy:true,
      },
   });
	
   geolocation.setTracking(true);
	
   var accuracyFeature = new ol.Feature();
   geolocation.on('change:accuracyGeometry', function() {
     accuracyFeature.setGeometry(geolocation.getAccuracyGeometry());
   });
   
   var positionFeature = new ol.Feature();
   positionFeature.setStyle(new ol.style.Style({
     image: new ol.style.Circle({
       radius: 6,
       fill: new ol.style.Fill({
         color: '#3399CC'
       }),
       stroke: new ol.style.Stroke({
         color: '#fff',
         width: 2
       })
     })
   }));
   
   geolocation.on('change:position', function() {
     var coordinates = geolocation.getPosition();
     positionFeature.setGeometry(coordinates ?
         new ol.geom.Point(coordinates) : null);
   });
   
   var trackingLayer = new ol.layer.Vector({
     source: new ol.source.Vector({
       features: [accuracyFeature, positionFeature],
     })
   });
   trackingLayer.ignoreHitDetection = true;
   map.addLayer(trackingLayer);
   
   /* End Geolocation */
	
   
   /* Update URL to contain zoom and position */
   map.on('moveend', updateLinkState);
   
})