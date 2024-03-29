
let url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/4.5_month.geojson";


let colorScale = d3.scaleSequential()
  .domain([0, 10]) 
  .interpolator(d3.interpolateYlOrRd); 

let map = L.map("map", {
    center: [28.58, -103.46],
    zoom: 3.5
  });



// Create a legend to display information about our map.
let legend = L.control({
    position: "bottomright"
  });
  
  // When the layer control is added, insert a div with the class of "legend".
  legend.onAdd = function() {
    let div = L.DomUtil.create("div", "legend");
    // console.log(div);
    return div;
  };
  // Add the info legend to the map.
  legend.addTo(map);
  

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
        layer.bindPopup("<b>depth:</b> " + feature.properties.mag + "<br><b>Location:</b> " + feature.properties.place);
      }
    }).addTo(map);
  })
  .catch(function(error) {
    // Handle error if any
    console.log(error);
  });

// Helper functions for styling and formatting
function getColor(feature) {
  let depth = feature.geometry.coordinates[2];
  return colorScale(depth);
}

function getRadius(magnitude) {
  return Math.sqrt(Math.abs(magnitude)) * 5;
}


