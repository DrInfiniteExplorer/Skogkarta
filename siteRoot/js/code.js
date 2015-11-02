<?php
function param($a)
{ if(array_key_exists($a, $_REQUEST)){ return $_REQUEST[$a]; } }

$area = param("area");
if($area) { $path_parts = pathinfo($area); $file_name  = $path_parts['basename']; $area  = $file_name; }
else { header("Location: /"); exit; }
?>

$(function(){
	var map;
   var vectorLayer;
   var loadData;
   
   var dataSet="2";
   var mapCenterX;
   var mapCenterY;
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
      if(mapCenterX && mapCenterY) return;
      function fitMapToExtent(extent){
         map.getView().fit(extent, map.getSize());
      }
      fitMapToExtent(vectorLayer.getSource().getExtent())
      fitMapOnFirstLoad = function(){}
   }

   loadData = function(dataSetName) {
      dataSet = dataSetName;
      updateLinkState();
      var url = "/data/sksAvverkAnm" + area + "/" + dataSetName;

      map.removeLayer(vectorLayer);

      var vectorSource = new ol.source.Vector({
         url: url,
         format: geoJSONFormat,
         //loader: function(extent, resolution, projection) {
         //   //var url = 'geojson2.php?p=' + extent.join(',');
         //   $.ajax({
         //      url: url,
         //      success: function(data) {
         //         vectorSource.addFeatures(geoJSONFormat.readFeatures(data));
         //      }
         //   }); 
         //},
      })
      vectorSource.once('change', fitMapOnFirstLoad);
      
      vectorLayer = new ol.layer.Vector({
          title: 'added Layer',
          source: vectorSource,
          style: styleFunction,
      })
      map.addLayer(vectorLayer);
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

   var gmap = new google.maps.Map(document.getElementById('gmap'), {
      disableDefaultUI: true,
      keyboardShortcuts: false,
      draggable: false,
      disableDoubleClickZoom: true,
      scrollwheel: false,
      streetViewControl: false
    });
    gmap.setMapTypeId(google.maps.MapTypeId.HYBRID);
    
   var view = new ol.View({
      center: ol.proj.transform([mapCenterX,mapCenterY], 'EPSG:3006', 'EPSG:900913'),
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
   
   var googleHackLayer = {
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

   var baseLayerList = [
      googleHackLayer,
      bingMapLayer,
      layerOSM,
      layerMQOSM,
      layerMQSat,
   ];

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
   }, 1000);
   
   function addLegend(displayName, colorOutline, colorFill) {
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
      var row = $('<li>').addClass('legend-list-item');
      var legendKey = $('<div>').addClass('legend-key');
      var legendName=$('<span>');
      legendName.text(displayName);
      legendKey.css({ 'border-color': colorOutline, 'border-width':'2px', 'border-style':'solid', 'background-color': colorFill});
      row.append(legendKey);
      row.append(displayName);
      legendList.append(row);
   }
   
   addLegend('Avverkningsanmälan', stylesZoom0);
   
   /* End legend */
   

   /* Metadata */
   
   var metadataShort = $('#meta-short');
   function isDisplayable(x){
      return (typeof x == 'number') || (typeof x == 'string')
   }
   function setMetadata(feature) {
      metadataShort.empty();
      if(!feature) {
         metadataShort.hide(100);
         return;
      }
      metadataShort.show(50);
      var attributes = feature.getProperties();
      var table = $('<table>');
      var headings = $('<tr>');
      var datas = $('<tr>');
      $.each(attributes, function(key, value) {
         if(!isDisplayable(value)) return;
         var heading = $('<th>');
         heading = heading.text(key);
         headings.append(heading);
         if(typeof value == 'string' && (value.startsWith("http://") || value.startsWith("https://"))) {
            value = $('<a>').attr('href', value).attr('target', 'blank').append('[Info]');
         }
         var data = $('<td>');
         data.append(value);
         datas.append(data);
      });
      table.append(headings, datas);
      metadataShort.append(table);
   }
   
   function grabFeatureForMetadata(event) {
      var pixel = event.pixel;
      var feature = map.forEachFeatureAtPixel(pixel, function(feature, layer) {
         return feature;
      });
      setMetadata(feature);
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
     ],
     target: olMapDiv,
     view: view,
     interactions: interactions,
     controls : controls,
   });
   
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
   var vectorSourcesksNyckelbiotoper = new ol.source.Vector({
      url: "/data/sksNyckelbiotoper" + area + "/0",
      format: geoJSONFormat,
   })
   
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
   var vectorSourcesksNaturvarden = new ol.source.Vector({
      url: "/data/sksNaturvarden" + area + "/0",
      format: geoJSONFormat,
   })
   
   var vectorLayerNaturvarden = new ol.layer.Vector({
       title: 'Naturvarden',
       source: vectorSourcesksNaturvarden,
       style: styleFunctionNaturvarden,
   })
   map.addLayer(vectorLayerNaturvarden);
   view.on('change:resolution', function(){
      var zoom = view.getZoom();
      vectorLayerNaturvarden.setVisible(zoom >= 12);
      
   });

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
   
   var trackingOverlay = new ol.layer.Vector({
     source: new ol.source.Vector({
       features: [accuracyFeature, positionFeature]
     })
   });
   map.addLayer(trackingOverlay);
	
   map.on('moveend', updateLinkState);
   
})