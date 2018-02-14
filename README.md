Mapping Application:

Goals:
1. A modular application with multiple components
2. The extension of google maps for custom applications with geocoded coordinates.

Technology Stack:
React.js

API:

<strong>Map Component:</strong>   
props:   Api_Key, container_style, map_style
interface:  x, y, lat, lng   ==>  Changing pixel x y or lat lng should adjust its counterpart
  ==>methods setXY(x,y)   setLatLng(lat,lng)  getXY()  getLatLng();
  
Tests: 
1) API Loads.
2) Map is visible.
3) Set XY before map loads fails gracefully


 
  