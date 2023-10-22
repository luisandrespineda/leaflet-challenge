// Create a map object.
let myMap = L.map("map", {
    center: [37.09, -95.71],
    zoom: 5
  });

// Add a tile layer.
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(myMap);

//Create Legend
//Create a legend to display information about our map.
let info = L.control({
  position: "bottomright"
});

info.onAdd = function() {
  let div = L.DomUtil.create("div", "legend");
  return div;
};
// Add the info legend to the map.
info.addTo(myMap);

function updateLegend() {
  document.querySelector(".legend").innerHTML = [
    "<p class='tier_1'> - 10-10 </p>",
    "<p class='tier_2'> 10-30 </p>",
    "<p class='tier_3'> 30-50 </p>",
    "<p class='tier_4'> 50-70 </p>",
    "<p class='tier_5'> 70-90: </p>",
    "<p class='tier_6'> 90+: </p>"
  ].join(""); 
}

//Setting the URL to the Earthquake Data
let url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";
console.log(url)

d3.json(url).then(function(response) {

    //console.log(response);
    features = response.features;
  
    console.log(features.length);

    // Comment this line in to render all 80,000 markers
    let marker_limit = features.length;
    //let marker_limit = 1000;
    

  for (let i = 0; i < marker_limit; i++) {

    let location = features[i].geometry;
    if (location) {
      // Extract the magnitude value from the GeoJSON properties
      let magnitude = features[i].properties.mag;
      let depth = features[i].geometry.coordinates[2];
      let latitude = location.coordinates[1];
      let longitude = location.coordinates[0];

    let colorScale = d3.scaleLinear()
      .domain([0, 100])
      .range(["green", "red"]);

      // Calculate the radius based on the magnitude (adjust the multiplier as needed)
      let radius = magnitude * 5;
      let mark_color = colorScale(depth);

    let popupContent = `
      <h3>Magnitude: ${magnitude}</h3>
      <p>Latitude: ${latitude}</p>
      <p>Longitude: ${longitude}</p>
      <p>Depth: ${depth} km</p>
  `;  

      // Create a circle marker with the calculated radius
      L.circleMarker([location.coordinates[1], location.coordinates[0]], {
        radius: radius,
        fillOpacity: 0.7,
        color: mark_color
      }).bindPopup(popupContent).addTo(myMap)
    }
  
  updateLegend();

  }
  });