/*"StAuth10244: I Dhruvisha Patel, 000837889 certify that this material is my original work. No other person's work has been used without due acknowledgement. I have not made my work available to anyone else.*/
/* variable declarations */
var map;
var markers = [];
var loadedMarkers = {
    "Arenas": false,
    "PlaceofWorship": false,
    "Waterfalls": false,
};
var directionsService;
var directionsRenderer;
//function to geocode for the address
function geocodeAddress() {
    var address = document.getElementById("address").value;
    //Create a geocoder object
    var geocoding = new google.maps.Geocoder();
    //This is to geocode the address provided
    geocoding.geocode({ address: address }, function (results, status) {
        //if geocoding is successful it will create the marker and set the map at center
        if (status === "OK" && results[0]) {
            var location = results[0].geometry.location;
            var marker = new google.maps.Marker({
                position: location,
                map: map,
                title: "Geocoded Location",
            });

            map.setCenter(location);
            //if geocoding fails it will pop up with the alert
        } else {
            alert("Geocode is not successful  " + status);
        }
    });
}
// Function to show user's position on the map
function showPositionOnMap(position) {
    var userLocation = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);

    var address = document.getElementById("address").value;
     // Create a geocoder object
    var geocoding = new google.maps.Geocoder();
    // Geocode the provided address
    geocoding.geocode({ address: address }, function (results, status) {
        if (status === "OK" && results[0]) {
            var destination = results[0].geometry.location;
            // Define a request for directions
            var request = {
                origin: userLocation,
                destination: destination,
                travelMode: "DRIVING",
            };
             // Request directions and render them
            directionsService.route(request, function (result, status) {
                if (status === "OK") {
                    directionsRenderer.setDirections(result);
                } else {
                    alert("Directions request failed: " + status);
                }
            });
        } else {
            alert("Geocode was not successful for the following reason: " + status);
        }
    });
}
// Initialize the map
function initMap() {
    map = new google.maps.Map(document.getElementById("map"), {
        center: { lat: 43.2387, lng: -79.8881 },
        zoom: 12,
    });
    directionsService = new google.maps.DirectionsService();
    directionsRenderer = new google.maps.DirectionsRenderer();
    directionsRenderer.setMap(map);
    var infowindow = new google.maps.InfoWindow();
     // Function to handle marker click
    function marker_clicked() {
        infowindow.close();
        infowindow.setContent(this.NAME);
        infowindow.open(map, this);
    }


    // Event listeners for buttons
    document.getElementById("geocodebutton").addEventListener("click", function () {
        geocodeAddress();
    });
    document.getElementById("AllMarkers").addEventListener("click", function () {
        loadDataFromURL();
    });

    document.getElementById("Arenas").addEventListener("click", function () {
        filterMarkers("Arenas");
    });

    document.getElementById("worship").addEventListener("click", function () {
        filterMarkers("PlaceofWorship");
    });

    document.getElementById("Waterfalls").addEventListener("click", function () {
        filterMarkers("Waterfalls");
    });
     // Function to load data from external URL
    function loadDataFromURL() {
        if (!loadedMarkers["Arenas"]) {
            loadMarkers('arenas.js', 'http://maps.google.com/mapfiles/kml/paddle/grn-blank.png', 'Arenas');
            loadedMarkers["Arenas"] = true;
        }
        if (!loadedMarkers["PlaceofWorship"]) {
            loadMarkers('placeofworship.js', 'http://maps.google.com/mapfiles/kml/paddle/pink-blank.png', 'PlaceofWorship');
            loadedMarkers["PlaceofWorship"] = true;
        }
        if (!loadedMarkers["Waterfalls"]) {
            loadMarkers('waterfalls.js', 'http://maps.google.com/mapfiles/kml/paddle/blu-blank.png', 'Waterfalls');
            loadedMarkers["Waterfalls"] = true;
        }
    }
    // Function to load markers from JSON data
    function loadMarkers(url, iconUrl, type) {
        fetch(url)
            .then((response) => response.json())
            .then((data) => {
                for (var i = 0; i < data.length; i++) {
                    var new_marker = new google.maps.Marker({
                        position: {
                            lat: parseFloat(data[i].LATITUDE),
                            lng: parseFloat(data[i].LONGITUDE),
                        },
                        title: data[i].NAME,
                        icon: iconUrl,
                    });

                    new_marker.setMap(map);
                    new_marker.NAME = data[i].NAME;
                    new_marker.type = type;
                    new_marker.addListener('click', marker_clicked);
                    markers.push(new_marker);
                }
            })
            .catch(function (error) {
                console.error("Error loading " + url + ":", error);
            });
    }
    // Function to filter markers based on type
    function filterMarkers(type) {
        for (var i = 0; i < markers.length; i++) {
            var marker = markers[i];
            if (type === "AllMarkers" || marker.type === type) {
                marker.setVisible(true);
            } else {
                marker.setVisible(false);
            }
        }
    }
    // Event listener to get user's geolocation
    document.getElementById("geolocation").addEventListener("click", function () {
        navigator.geolocation.getCurrentPosition(showPositionOnMap);
    });
    // Function to show user's position on the map
    function showPositionOnMap(position) {
        user_location = new google.maps.Marker({
            position: {
                lat: position.coords.latitude,
                lng: position.coords.longitude,
            },
            title: "Your Location",
            icon: "car.png",
        });

        user_location.setMap(map);
    }


}