<?php
function param($a)
{
   if(array_key_exists($a, $_REQUEST)){
      return $_REQUEST[$a];
   }
}

$area = param("area");
if($area) {
    $path_parts = pathinfo($area);
    $file_name  = $path_parts['basename'];
    $area  = $file_name;
}
else {
    header("Location: /");
    exit;
}


function loadData()
{
    $data = param("data");
    if($data) {
    }
    else {
        $data = "senaste_veckan";
    }
	echo("\tloadData('$data');");
}
?>
$(function(){
	var map;
	var infoWindow;
	function initialize() {
		var mapOptions = {
			center: new google.maps.LatLng(58.24, 15.37),
			zoom: 8
		};
		map = new google.maps.Map(document.getElementById("map-canvas"), mapOptions);
		infoWindow = new google.maps.InfoWindow();
	}

	/** @this {google.maps.Polygon} */
	function showInfo(event) {
        infoWindow.close();
        delete infoWindow;
		var stuff = this.stuff;

		// how do we copy objects? nevermind lets be retarded
		stuff = JSON.parse(JSON.stringify(stuff));
		delete stuff.polygons;
		
		contentString = JSON.stringify(stuff);
		
		contentString = "";
		for(key in stuff) {
			contentString += "<p><b>" + key + ":</b> " + stuff[key] + "</p><br/>\n";
		}

        var wrapper = document.createElement("div");

        // inject markup into the wrapper
        wrapper.innerHTML = contentString;

        // style containing overflow declarations
        wrapper.className = "map-popup";

        // initialize the window using wrapper node     
        infoWindow = new google.maps.InfoWindow({content: wrapper});

		// Replace the info window's content and position.
		//infoWindow.setContent(contentString);
		infoWindow.setPosition(event.latLng);

		infoWindow.open(map);
	}

	google.maps.event.addDomListener(window, 'load', initialize);
	SetSWEREF99WGS84();
	
	var mapObjects = [];
	var addDataToMap;
	var loadData;
	
	var addObject;
	var clearObjects;
	
	var sortEntries;
	var sortEntryKey = "all";
	var sortAsc = false;
	
	var sortFuncs = {
		all: function(a, b) {			
			a = $(a).text()
			b = $(b).text()
			var mod = sortAsc ? 1 : -1;
			if(a < b) return -1 * mod;
			if(b < a) return  1 * mod;
			return 0;
		},
	}
	
	sortEntries = function(key) {
		if(key) {
			sortEntryKey = key;
		}
		key = sortEntryKey;		
		var sortFunc = sortFuncs[key];
		//alert(sortFunc)
		$("#entryList a").sort(sortFunc).appendTo("#entryList");
	}
	
	
	addObject = function(mapObj) {
		mapObj.setMap(map);				
		google.maps.event.addListener(mapObj, 'click', showInfo);
		var stuff = mapObj.stuff;
		var entryFocus = function() {
			var polys = stuff.polygons;
			var x = 0;
			var y = 0;
			var num = 0;
			for(idx in polys) {
				var poly = polys[idx];
				for(ptIdx in poly) {
					var pt = poly[ptIdx];
					x = x + pt.x;
					y = y + pt.y;
					num = num + 1;
				}
			}
			x = x / num;
			y = y / num;
			var LL = {};
			XYtoLatLong({x : x, y : y}, LL);
			var newPt = new google.maps.LatLng(LL.Lat, LL.Long);
			
			map.setCenter(newPt);
		}
		
		var entryFocusZoom = function(mapObj) {
		
			entryFocus(mapObj)
		}
		
		var entryName = stuff.Inkomdatum + " " + stuff.Beteckn;
		var entryObj = $('<a>').attr('class','entry').append(entryName);
		entryObj.click(entryFocus);
		entryObj.dblclick(entryFocusZoom);
		
		var entryList = $("#entryList");
		entryList.append(entryObj);
		
		
		
		mapObjects.push({ mapObj: mapObj, entryObj: entryObj});
		
	}

	clearObjects = function() {
		for(idx in mapObjects) {
			var mapObj = mapObjects[idx].mapObj;			
			mapObj.setMap(null);		
			var entryObj = mapObjects[idx].entryObj;
			entryObj.remove();			
			
		}
		mapObjects = [];
	}
	
    var area = '<?php echo($area); ?>';

	loadData = function(name) {
        var call = "/data/" + area + "/" + name;
		$.getJSON(call, addDataToMap);
	}
	
	addDataToMap = function(data) {
		for (idx in data) {
			var object = data[idx];
			var polygons = object.polygons;
			for(polyIdx in polygons) {
				var polygon = polygons[polyIdx];
				var googlePoly = [];
				for(ptIdx in polygon) {
					var pt = polygon[ptIdx];
					var LL = {};
					pt.z = pt.x;
					pt.x = pt.y;
					pt.y = pt.z;
					XYtoLatLong(pt, LL);
					var newPt = new google.maps.LatLng(LL.Lat, LL.Long);
					googlePoly.push(newPt);
				}
				var mapObject = new google.maps.Polygon({
					paths: googlePoly,
					strokeColor: '#FF0000',
					strokeOpacity: 0.8,
					strokeWeight: 2,
					fillColor: '#FF0000',
					fillOpacity: 0.35,
					stuff:object,
				});

				addObject(mapObject);
			}
		}
		sortEntries();
	};
	
	$("#toggleEntries").click(function() {
		var entries = $("#entries");
		var width = entries.width();
		var collapse = width == 200;
		var widthStr = "" + ( collapse ? 40 : 200) + "px";
		$("#toggleEntries").text( collapse ? ">>" : "<<");
		//alert(widthStr);
		//return;
		entries.animate({width:widthStr});
	});
	
	function addData(file, name) {
        var url = '/show/' + area + '/' + file;
        var link = $("<a>", {
            class : "setData",
            text : name,
            href : url,
            click: function(){
                clearObjects();
                loadData(file);
                history.replaceState(null, '', url);
                return false;
            }
        })
		
		$("#navbar").append(link);
	}
	
	addData("senaste_veckan", "7 dar");
	addData("senaste_manaden", "31 dar");
	addData("senaste_6veckorna", "6 veckor");

	//loadData("senaste_veckan.json");
	//loadData("senaste_7");
    <?php loadData(); ?>

})