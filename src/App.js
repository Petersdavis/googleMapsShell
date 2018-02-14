import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import logo from './logo.svg';
//import target from './target.svg';
import './App.css';
//import {Glyphicon, Row, Col, Button, FormControl} from 'react-bootstrap';
import Script from 'react-load-script';


class MapContainer extends Component {
	constructor(props) {
		super(props);
		
    this.mouseOver= this.mouseOver.bind(this);       
      
    }
	
	componentDidMount(){
		this.props.containerReady(this.props.mapRef);	
		
	}
	
	mouseOver(e){
		var coords = {};
		
		coords.x = e.clientX;
		coords.y = e.clientY;
		
		
		this.props.mouseOver(coords);
		
	}
	render(){
			
		const map_style = {
		 	position: 'absolute',
			width: '100%',
			height: '100%'
		  };
		const container_style = {
			position: 'absolute',
			left: 0,
			right: 0,
			bottom: 0,
			top:"100px"
		  }
		const ref = this.props.mapRef;
		return(
			<div style = {container_style}>
			<div onMouseMove={this.mouseOver} ref = {ref} style={map_style} >  Map is Loading ...</div>
			
			</div>
			)
	}
	
}
class Map extends Component {
	constructor(props) {
		super(props);

    this.state = {
    	currentLocation:{
    		lat:43.4844178,
    		lng:-80.5327317    		
    	},
    	
    	zoom:10
     
    }
    
    this.loadMap= this.loadMap.bind(this);       
    this.storeMap= this.storeMap.bind(this);
    
    }
    
    componentDidMount() {
    	this.loadMap();	
    }
    
    componentDidUpdate(prevProps, prevState){
		
		  this.loadMap();
		 	
    	
    }
    
   storeMap(map){
   	   this.props.storeMap(map);
   		   
   }

    
    loadMap(){
    	var google = this.props.google;	
		if(!google.container_ready){
			console.log("map_container not yet loaded ...");    	
			return;	
		}
		
		if(google.is_loaded ){
			if(google.google === null){
				console.log ("google should not be null! ");
			}else{
				console.log ("google is loaded and exists...");	
				
				if(this.props.map === null){
					
				console.log ("map does not exist:  creating map...");	
				var googleApi = google.google;
				var maps = googleApi.maps;
				const mapRef = this.props.mapRef;
				const node = ReactDOM.findDOMNode(mapRef);
				const curr = this.state.currentLocation;
				const center = new maps.LatLng(curr.lat, curr.lng);
				
				var map = new maps.Map(node, {center:center, zoom:this.state.zoom});
				this.storeMap(map);
				}else{
					console.log ("map exist");	
				}
			}
					
				
				
		}else{
			console.log("google is not yet loaded ... ");
				
		}
    	
    }
    
    render(){
    
    	
    	
    return(
    		<div> </div>
    		
    	
    	)
    }
    
}

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
    	google:{
    		container_ready: false,
    		is_loaded:false,
    		google:null,
    		url: 'https://maps.googleapis.com/maps/api/js?',
    		api_key:'AIzaSyCmMnZ4ZQrCCXcwUSYXOkqmU9tMjK5lxxs'
    	},
    	
    	map:null,
    	
    	map_container:{
    		ref:null
    	}
     
    }
    
    this.googleReady = this.googleReady.bind(this);
    this.containerReady = this.containerReady.bind(this);
    this.storeMap = this.storeMap.bind(this);
    this.mouseOverMap = this.mouseOverMap.bind(this);
    
  }
  containerReady(ref){
  	  console.log("containerReady Fired!");
  	  var google = this.state.google;
  	  google.container_ready = true;
  	  this.setState({google});
  	  
  	  var map_container =this.state.map_container;
  	  map_container.ref = ref;
  	  this.setState({map_container});
  }
  
  googleReady(){
  	  console.log("googleReady Fired!");
  	  var google = this.state.google;
  	  google.google = window.google;
  	  google.is_loaded = true;
  	  this.setState({google});
  }
  storeMap(new_map){
  	var map = this.state.map
  	if(map !== new_map){
  		map = new_map;	
  		this.setState({map:map});
  	}
  	
  }
  
  mouseOverMap(coords){
  	  console.log( coords.x+ " "+ coords.y)
  	  var latLng;
  	  latLng = this.point2LatLng(coords);
  	  console.log (latLng.lat() + "  " +latLng.lng())
  }
  
  latLng2point(latLng){
  	  var map =  this.state.map;
  	  var coords = {};
  	  
  	  if(map===null){
  	  	console.log("map does not exist");
  	  	return null; 	  	  
  	  }else{
  	  	  var topRight = map.getProjection().fromLatLngToPoint(map.getBounds().getNorthEast());
		  var bottomLeft = map.getProjection().fromLatLngToPoint(map.getBounds().getSouthWest());
		  var scale = Math.pow(2, map.getZoom());
		  var worldPoint = map.getProjection().fromLatLngToPoint(latLng);
		  coords.x = (worldPoint.x - bottomLeft.x) * scale
		  coords.y = (worldPoint.y - topRight.y) * scale;
  	  	  return coords;
  	  }
  }
  point2LatLng(point) {
  	  var google = this.state.google.google;
  	  var map = this.state.map
	  var topRight = map.getProjection().fromLatLngToPoint(map.getBounds().getNorthEast());
	  var bottomLeft = map.getProjection().fromLatLngToPoint(map.getBounds().getSouthWest());
	  var scale = Math.pow(2, map.getZoom());
	  var worldPoint = new google.maps.Point(point.x / scale + bottomLeft.x, point.y / scale + topRight.y);
	  return map.getProjection().fromPointToLatLng(worldPoint);
	}
  
	
  render() {
  	  
  	 const url = this.state.google.url + "key=" +this.state.google.api_key
     return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to React</h1>
        </header>
        <div className="App-intro">
        	<Script url={url} onLoad= {this.googleReady}/> 
        	<MapContainer mouseOver ={this.mouseOverMap} mapRef={el => this.state.map_container.ref = el} 
        		containerReady = {this.containerReady} />
    	   	<Map map = {this.state.map} storeMap = {this.storeMap} mapRef = {this.state.map_container.ref} google = {this.state.google}/>
        	
        </div>
      </div>
    );
  }
}

export default App;
