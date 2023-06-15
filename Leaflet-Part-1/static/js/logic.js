

// // Adding the tile layer
// L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
//     attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
// }).addTo(myMap);


// d3.json(quakeURL).then(function(response) {
//     let markers = L.markerClusterGroup();
//     for (let i=0; i< response.length; i++){
//         let location = response[i].location;
//         if (location) {
//             markers.addLayer(L.marker([location.coordinates[1],location.coordinates[0]])
//             .bundPopup(response[i].descriptor));
        
//         }
//     }
//     myMap.addLayer(markers);
// })

let colorScale = d3.scaleSequential()
  .domain([0, 10]) // Adjust the domain based on your data range
  .interpolator(d3.interpolateYlOrRd); // Adjust the color scale as desired (e.g., interpolateBlues, interpolateReds, etc.)

let legend = L.control({ position: 'bottomright' });


let url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/4.5_month.geojson";

let map = L.map("map", {
    center: [28.58, -103.46],
    zoom: 3.5
  });



// Create a legend to display information about our map.
let info = L.control({
    position: "bottomright"
  });
  
  // When the layer control is added, insert a div with the class of "legend".
  info.onAdd = function() {
    let div = L.DomUtil.create("div", "legend");
    return div;
  };
  // Add the info legend to the map.
  info.addTo(map);
  



  L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
    subdomains: 'abcd',
    attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community',  minZoom: 0,
    maxZoom: 18,
    ext: 'png'
  }).addTo(map);


  
d3.json(url)
  .then(function(data) {
    // Process the data here
    L.geoJSON(data, {
      pointToLayer: function(feature, latlng) {
        return L.circleMarker(latlng);
      },
      style: function(feature) {
        return {
          fillColor: colorScale(feature.properties.mag),
          fillOpacity: 0.8,
          radius: getRadius(feature.properties.mag),
          color: "black",
          weight: 0.5
        };
      },
      onEachFeature: function(feature, layer) {
        layer.bindPopup("<b>Magnitude:</b> " + feature.properties.mag + "<br><b>Location:</b> " + feature.properties.place);
      }
    }).addTo(map);
  })
  .catch(function(error) {
    // Handle error if any
    console.log(error);
  });

// Helper functions for styling and formatting
function getColor(magnitude) {
  return magnitude > 5 ? "#f06b6b" :
         magnitude > 4 ? "#f0a76b" :
                         "#f3ba4d";
}

function getRadius(magnitude) {
  return Math.sqrt(Math.abs(magnitude)) * 4;
}