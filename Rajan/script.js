//Get different map vieport on width screen values
let getcenter, getzoom, geoLocControl; 

if (window.innerWidth > 768) {
   getcenter = [10, 0];
   getzoom = 1.45;
   columns = 4; 
   minzoom = 1.45;
   className = '<div class="legend-items">';
}
   
else
  
  {  getcenter = [10, 0]
     getzoom =0.08; 
     columns = 2;
     minzoom=0.05;
     className = '<div class="legend-items2">'; 
 
  } ;

  
   //Function for toggling between Map and List
  function showMap() {

	document.getElementById("map").style.display = "block";
    document.getElementById("mapContainerTop").style.display = "block";
	document.getElementById("table-container").style.display = "none";
     
    //Style buttons
    document.getElementById("map-tab").classList.add("buttonSelected");
    document.getElementById("list-tab").classList.remove("buttonSelected");
  }
  
  function showTable() {
	document.getElementById("table-container").style.display = "block";
	document.getElementById("map").style.display = "none";
    document.getElementById("mapContainerTop").style.display = "none";
    //Style buttons
    document.getElementById("list-tab").classList.add("buttonSelected");
    document.getElementById("map-tab").classList.remove("buttonSelected");
  };
  
  //call the function to show the map when the page loads
  showMap();

//Fetch csv data  from google sheets with papa.parse
Papa.parse("https://docs.google.com/spreadsheets/d/15Fhb7nWSG0WlKzlD96Qy8VfjHuZPa4P0AVIKJqALPtM/gviz/tq?tqx=out:csv&sheet=countries_db", {
    download: true,
    header: true,
    complete: function(results) {
        var csvData = results.data;
        //load geojson
        d3.json("./data/countires.geojson").then(function(geojson) {

            //Join Data
            geojson.features.forEach(function(feature) {
                var row = csvData.filter(function(d) {
                    return d.alpha2 === feature.properties.ISO_A2
                })
                if (row.length > 0) {
                    Object.assign(feature.properties, row[0]);
                }
            });




         

// Get Table Dom
var sortOptions = document.getElementById("sort-options");
sortOptions.addEventListener("change", () => sortTableData(sortOptions.value));
// Sort the table in alphabetical order on page load
sortTableData("alphabetical");

function sortTableData(sortType) {
    switch(sortType) {
        case "alphabetical":
        csvData.sort((a, b) => (a.Country > b.Country) ? 1 : -1);
        renderTable(csvData);
        break;
        //Sort it so from Low to High
        case "LowToHigh":
            csvData.sort(function(a, b) {
                if (a.Type === "OBS Country" && b.Type !== "OBS Country") {
                    return -1;
                }
                if (b.Type === "OBS Country" && a.Type !== "OBS Country") {
                    return 1;
                }
                if (a.Type === "Multiple Projects" && b.Type !== "Multiple Projects") {
                    return -1;
                }
                if (b.Type === "Multiple Projects" && a.Type !== "Multiple Projects") {
                    return 1;
                }
                if (a.Type === "Country Office" && b.Type !== "Country Office") {
                    return -1;
                }
                if (b.Type === "Country Office" && a.Type !== "Country Office") {
                    return 1;
                }
                if (a.Type === "" && b.Type !== "") {
                    return 1;
                }
                if (b.Type === "" && a.Type !== "") {
                    return -1;
                }
                return 0;
            }); 
            renderTable(csvData);
            break;

            //Sort it from highest to lowest
            case "HighToLow":   
            csvData.sort((a, b) => {
                if (a.Type === b.Type) {
                return 0;
                }
                if (a.Type === "Country Office") {
                return -1;
                }
                if (b.Type === "Country Office") {
                return 1;
                }
                if (a.Type === "Multiple Projects") {
                return -1;
                }
                if (b.Type === "Multiple Projects") {
                return 1;
                }
                if (a.Type === "OBS Country") {
                return -1;
                }
                if (b.Type === "OBS Country") {
                return 1;
                }
                if (a.Type === "") {
                return -1;
                }
                if (b.Type === "") {
                return 1;
                }
                });
                renderTable(csvData);
                break;
       
        }};

//TABLE-----------------------------------------------------

function renderTable (csvData) {

        // Clear any existing table
        var tableContainer = document.getElementById("table");
        while (tableContainer.firstChild) {
            tableContainer.removeChild(tableContainer.firstChild);
            }
        var legendContainerWraper = document.getElementById("legendContainer") 
        while (legendContainerWraper.firstChild) {
            legendContainerWraper.removeChild(legendContainerWraper.firstChild);
            }   
        // Create the table element
        var table = document.createElement("table");
        table.setAttribute("style", "width: 100%;");

       
        // Create a container div for the legend
        var legendContainer = document.createElement("div");
        legendContainer.classList.add("legend-container");
         // Create the table head
         var thead = document.createElement("thead");
         legendContainer.classList.add("legend-container");


        // Add the legend div to the table 
        const grades = ['#52C3C9',  '#0083A9', '#034A8A'];
        const labels = ["Open Budget Survey Countries" , "Countries with Multiple Projects", "Country Office"];
        
        //Legend DIV
        var legendDiv = document.createElement("legend2");
        legendDiv.classList.add("legend2");
        legendDiv.innerHTML = '<div class="legend-title2">IBP Engagement</div>'
        legendDiv.innerHTML += '<div class="legend-items2"></div>'
        for (let i = 0; i < grades.length; i++) {
            legendDiv.innerHTML += className +
            '<i class="legend-circle" style="background:' + grades[i] + '"></i>' +
            '<div class="legend2-rows">' + labels[i] + '</div>' +
            '</div>';
        }
        thead.appendChild(legendDiv);
        // Add the legend div to the container
        legendContainer.appendChild(thead);
          // Add the table to the document
        document.getElementById("legendContainer").appendChild(legendContainer);



        // Create the table body
        var tbody = document.createElement("tbody");

        // Iterate over the data array and create a new row for each object
        for(var i = 0; i < csvData.length; i+=4){
            var row = document.createElement("tr");
            for(var j = i; j < i+columns; j++){
                if(csvData[j]){
                    var cell = document.createElement("td");
                    if(j == i+3){
                        cell.classList.add("last-cell")
                    }
                    // Set the class of the cell based on the "Type" field of the data
                    if(csvData[j].Type == "OBS Country"){
                        cell.classList.add("Type1")
                    }
                    if(csvData[j].Type == "Multiple Projects"){
                        cell.classList.add("Type2")
                    }
                    if(csvData[j].Type == "Country Office"){
                        cell.classList.add("Type3")
                    }

                    if (csvData[j].URL) {
                        var link = document.createElement("a");
                        link.href = csvData[j].URL;
                        link.innerHTML = csvData[j].Country;
                        link.target = "_self";
                        cell.appendChild(link);
                      } else {
                        cell.innerHTML = csvData[j].Country;
                      }
                    row.appendChild(cell);
                }
            }
            tbody.appendChild(row);
        }
        table.appendChild(tbody);
        // Add the table to the document
        document.getElementById("table").appendChild(table);

}; //--END OF TABLE AND FUNCTIONS FOR ORDERING ARRAYS --------------------

//-----------------------------------------------------
//map init

var crs = new L.Proj.CRS('EPSG:54009', '+proj=robin +lon_0=0 +x_0=0 +y_0=0 +a=6371000 +b=6371000 +units=m +no_defs', {
    resolutions: [65536, 32768, 16384, 8192, 4096, 2048] 
});


	
var map = L.map('map', {
    crs: crs,
    zoomDelta: 0.25,
    zoomSnap: 0.10,
	center: getcenter, 
	zoom: getzoom,
	maxZoom: 5.5,
	minZoom:minzoom, 
    invalidateSize:true,
	attributionControl: false,
    continuousWorld: true,
     worldCopyJump: false,
   
	});




//FULL SCREEN CONTROL
L.control.fullscreen({
    position: 'topleft'
}).addTo(map);


	// //set the max bounds to the whole world
	// var bounds = [[-90, -180], [90, 180]];
	// map.setMaxBounds(bounds);



    //Write function to get colors 
	function getColor(d) {
		return d === "OBS Country" ? '#52C3C9' :
			   d === "Multiple Projects"  ? '#0083A9' :
			   d === "Country Office"  ? '#034A8A' :
				'#dfdfdfff';
	}


	 //Functions to make a style of Joined data
	 function style(feature) {
		return {
			fillColor: getColor(feature.properties.Type),
			fillOpacity: 1,
			weight: 0.9,
			opacity:1,
			color: "white",
			dashArray: '1',
		};
	}

	// //Zoom to clicked feature - do not works weel with changed projection
	// function zoomToFeature(e) {
	// 	map.fitBounds(e.target.getBounds());
	// }

   
	//Highlight selected feature
	function highlightFeature(e) {
		var layer = e.target;
	
		layer.setStyle({
			weight: 2.5,		
			dashArray: '',
		});
	
	};

	//Reset Highlighted feature
	function resetHighlight(e) {
		geojson.resetStyle(e.target);
	}



	//Functionalities the data will have
	function onEachFeature(feature, layer) {
		layer.on({
            mouseover: function(e) {
                highlightFeature(e);
            },
            
            mouseout: function(e) {
                resetHighlight(e);
                
            }
		});
        
        //Make and Style pop-up
        layer.bindPopup(
            "<p style='display:inline-block; margin:0; padding:0 5px;'>" + 
              (feature.properties.URL ? 
                "<a href='" + feature.properties.URL + "' style='text-decoration: none; color: black; border-bottom: 1px solid #FF863A;'>" + feature.properties.ADMIN + "</a>" : 
                feature.properties.ADMIN
              ) + 
            "</p>" +
            "<div class='circle' style='background-color:"+ (feature.properties.Type === "" ? "#ffffff00" :  getColor(feature.properties.Type))+"; width:10px; height:10px; border-radius:50%; display:inline-block; margin-left:2px margin-top:1px; padding:0 0;'></div>" +
            "</div>"
          );
          
          


	  }


//Load geojson data to the Map API
var geojson=L.geoJSON(geojson, {
	style: style,
	onEachFeature: onEachFeature
}).addTo(map);


//LEGEND
var legend = L.control({position: 'bottomleft'});

legend.onAdd = function (map) {
    var div = L.DomUtil.create('div', 'info legend'),
        grades = ['#52C3C9',  '#0083A9', '#034A8A'],
        labels = ["Open Budget Survey Countries" , "Countries with Multiple Projects", "Country Office"];
    //Add title to the legend
    div.innerHTML += '<div class="legend-title">IBP Engagement</div>'
    div.innerHTML += '<div class="legend-bar"></div>'
    div.innerHTML += '<div class="legend-items"></div>'

    // loop through our density intervals and generate a colored bar for each interval
for (var i = 0; i < grades.length; i++) {
    div.innerHTML += '<div class="legend-column">' +
        '<i class="legend-bar" style="background:' + grades[i] + '"></i>' +
        '<div class="legend-item">' + labels[i] + '</div>' +
        '</div>';
}
//This way each bar and label will be in their own separate column, and all columns will be aligned with each other.

    return div;
};

legend.addTo(map); 


   //Reset view and other stuffs
   let resetView = document.getElementById('reset_view');                   
   resetView.addEventListener( 'click', (e) => {			
	  map.flyTo(getcenter, getzoom);
 });

			//END OF LEAFLET MAP 
            // Do something with the joined data
            // ...
        });
        
		 //Getting DOM element
          const loading = document.getElementById('loader');
		//END OF DATA PARSING AND LOADING AND MAP INTIT
		
		// Closing the loader
		setTimeout(() => { 
				loading.style.display = "none";   
		  }, 750) 
    }	
});

         

	
