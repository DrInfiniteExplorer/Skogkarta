<?php
function param($a)
{
   if(array_key_exists($a, $_REQUEST)){
      return $_REQUEST[$a];
   }
}
function codeInclude()
{
   $path = "code.js";
    if(param("area")) {
        $path_parts = pathinfo(param("area"));
        $file_name  = $path_parts['basename'];
        $area  = $file_name;
        $path = "/code/" . $area;
    if(param("data")) {
        $path_parts = pathinfo(param("data"));
        $file_name  = $path_parts['basename'];
        $data  = $file_name;
        $path = $path . "/" . $data;
    }
    }
    echo("<script type='text/javascript' src='$path'></script>");
}

?>
<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml">
  <head>  
	<meta http-equiv="Content-Type" content="text/html;charset=utf-8" />
    <meta name="viewport" content="initial-scale=1.0, user-scalable=no" />
	<title>Skogsdata!</title>
	<link type="text/css" rel="stylesheet" media="screen"  href="/css/default.css" />
   <link rel="stylesheet" href="/css/ol.css" type="text/css">

	<script type="text/javascript"  src="/js/jquery-2.0.3.min.js"> </script>
   <script src="/js/proj4.js" type="text/javascript"></script>
   <script src="/js/ol-debug.js" type="text/javascript"></script>
   <script type="text/javascript" src="https://maps.googleapis.com/maps/api/js?v=3&amp;key=AIzaSyBRTpJi_z1mwjqsSLYqxuzgyWomIiKLjDA&amp;sensor=false"></script>
    
    <?php codeInclude(); ?>
    
  </head>
  
  <body>
	<div id="map" class="map">
		<div id="olmap" class="fill" style="z-index:1"></div>
		<div class="fill gmapHiderr"></div>
      <div id="gmap" class="fill googlemap"></div>
      
      <div id="legend" class="legend" style="display:none">
         <a id="legend-closer" class="legend-closer"></a>
         <ul id="legend-list" class="legend-list" ></ul>
      </div>
      <div id="meta-popup" class="meta-popup" >
         <a id="meta-closer" class="meta-closer"></a>
         <div id="meta-content" class="meta-content"></div>
      </div>
	</div>
   <div id="meta-short" class="meta-short" style="display:none"></div>
	
  </body>
</html>
