var map;

var Markers = [];

// Array Of Locations	
var locations = [
    {title: 'Park Ave Penthouse',location:{lat: 40.7713024,lng: -73.9632393}},
    {title: 'Chelsea Loft',location:{lat: 40.7444883,lng: -73.9949465}},
    {title: 'Union Square Open Floor Plan',location:{lat: 40.7347062,lng: -73.9895759}},
    {title: 'East Village Hip Studio',location:{lat: 40.7281777,lng: -73.984377}},
    {title: 'TriBeCa Artsy Bachelor Pad',location:{lat: 40.7195264,lng: -74.0089934}},
    {title: 'Chinatown Homey Space',location:{lat: 40.7180628,lng: -73.9961237}}
  ];

function initMYMap() {    
  // Loading My Map
  map = new google.maps.Map(document.getElementById('map'), {
    zoom: 12,
    center: {lat: 40.7413549, lng: -73.99802439999996},
  });
   
  // make the map responsive 
	google.maps.event.addDomListener(window, "resize", function() {
		var center = map.getCenter();
		google.maps.event.trigger(map, "resize");
		map.setCenter(center);
	});

	// Start My View Model
	ko.applyBindings(new MyViewModel());  
}


// Start View MOdel
var MyViewModel = function (){
	
	 var self = this;
	 this.filterLocation = ko.observable("");
	 this.list_locations = ko.observableArray([]);
	
	// create my locations on my map
	
	for(var i=0; i < locations.length; i++) {
		self.list_locations.push(new CreateMyLocation(locations[i]));
	}
	
	this.CheckMyFilter = function ()
	{
		var ff = self.filterLocation().toLowerCase();
		for (var i = 0; i < self.list_locations().length; i++)
		{
			var pp = self.list_locations()[i].name.toLowerCase();
			if(pp.search(ff) >= 0)
			{
				self.list_locations()[i].visible(true);
			}
			else
			{
				self.list_locations()[i].visible(false);
			}
		}
	};
};

// hundle error 
function HandleError() {
	alert("Google Map failed to load.");
}

//  create locations
var CreateMyLocation = function (mylocation){

  var self = this;
	this.name = mylocation.title;
	this.lat = mylocation.location.lat;
	this.lng = mylocation.location.lng;
	this.timezone = "unknown";
	this.temperature = "unknown";
	this.pressure = "unknown";
	this.summary = "unknown";
	this.icon = "unknown";
	this.visible = ko.observable(true);
	
	
	// Create Markers 
  	self.marker = new google.maps.Marker({
		map: map,
		position: new google.maps.LatLng(mylocation.location.lat, mylocation.location.lng),
		title: mylocation.title,
		animation: google.maps.Animation.DROP,
	});
	
	// function for showing marker or not
	self.showTheMarker = ko.computed(function() {
		if(self.visible() === true)
		{
			self.marker.setMap(map);
		}
		else
		{
			self.marker.setMap(null);
		}
		return true;
	}, self);
	
	
	// url of place from dark sky website 
	var UrlOfDarkSkyApi  = 'https://api.darksky.net/forecast/165048d74caa6b84f80a61b7150309ae/'+this.lat+','+this.lng;
	var Exclude = "?exclude=minutely,hourly,daily,alerts,flags";
  var Unit = "?units=si";
	UrlOfDarkSkyApi += Exclude + Unit;
	// using ajax function for handle error
	$.ajax({
      url: UrlOfDarkSkyApi,
      dataType: "jsonp",
      success: function (weatherData) { 
		  // timezon
		self.timezone = weatherData.timezone;
		  // temprature
		self.temperature = weatherData.currently.temperature;
		  // pressure
		self.pressure = weatherData.currently.pressure;
		  // icon
		self.icon = weatherData.currently.icon;
		  // summary
		self.summary = weatherData.currently.summary;
		  
	
		// adding infowindow to location
		self.contentOfInfoWindow = '<div class="info-window-content"><div class="title"><b>';
		self.contentOfInfoWindow += "title: "+self.name + '</b></div>' ;
		self.contentOfInfoWindow += '<div class="content">' +"timezone: "+ self.timezone + '</div>' ;
		self.contentOfInfoWindow += '<div class="content">' +"temperature: "+self.temperature + '</div>' ;
		self.contentOfInfoWindow += '<div class="content">' +"icon: "+ self.icon + '</div>' ;
		self.contentOfInfoWindow += '<div class="content">' +"summary: "+ self.summary + '</div>' ;
		self.contentOfInfoWindow += '<div class="content">' +"pressure: "+ self.pressure + '</div></div>' ;

		//create new infoWindow
		self.infoWindow = new google.maps.InfoWindow({content: self.contentOfInfoWindow});

		// adding listener to the marker
		self.marker.addListener('click', function() {

			self.contentOfInfoWindow = '<div class="info-window-content"><div class="title"><b>';
			self.contentOfInfoWindow += "title: "+self.name + '</b></div>' ;
			self.contentOfInfoWindow += '<div class="content">' +"timezone: "+ self.timezone + '</div>' ;
			self.contentOfInfoWindow += '<div class="content">' +"temperature: "+ self.temperature + '</div>' ;
			self.contentOfInfoWindow += '<div class="content">' + "icon: "+self.icon + '</div>' ;
			self.contentOfInfoWindow += '<div class="content">' +"summary: "+ self.summary + '</div>' ;
			self.contentOfInfoWindow += '<div class="content">' +"pressure: "+ self.pressure + '</div></div>' ;
			self.infoWindow.setContent(self.contentOfInfoWindow);

			self.infoWindow.open(map, this);

			self.marker.setAnimation(google.maps.Animation.BOUNCE);

			setTimeout(function() {
	      		self.marker.setAnimation(null);
	     	}, 1000);
		});
	  }
	}).fail(function(){
		alert("error on loading api from dark sky website!");
	});
	
	self.activemarker = function()
	{
		google.maps.event.trigger(self.marker, 'click');
	};
};


function active(ob)
{
	alert(ob);
}
