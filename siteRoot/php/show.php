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

	<script type="text/javascript"  src="/js/jquery-2.0.3.min.js"> </script>
    <script type="text/javascript" src="https://maps.googleapis.com/maps/api/js?key=AIzaSyBRTpJi_z1mwjqsSLYqxuzgyWomIiKLjDA&amp;sensor=false"></script>
    <script type="text/javascript" src="http://www.gis.scb.se/how/sweref99/bjrt90latlong.js"></script>
    <?php codeInclude(); ?>
	
  </head>
  
  <body>
	<div id="navbar">
        <a class="changeArea" href="/">Byt län</a>
        <a class="copyright" href="http://www.skogsstyrelsen.se/Aga-och-bruka/Skogsbruk/Karttjanster/Skogsdataportalen1/">Källa ©Skogsstyrelsen</a>
	</div>
	<div id="main">
		<div id="entries">
			<div id="toggleEntries">&lt;&lt;</div>
			<div id="entryList">
			</div>
		</div>
		<div id="map-canvas"></div>
		<div class="clear"></div>
	</div>
	
  </body>
</html>
