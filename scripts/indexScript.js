mapboxgl.accessToken = 'pk.eyJ1IjoibmN1cnRpczQiLCJhIjoiY21oY2syc2FyMWJkbTJrcHpvbHVpbTh3NiJ9.IkITHi8RWT9S7GeJKh-QUQ';

let map = new mapboxgl.Map({
    container: 'map', // container ID
    style: 'mapbox://styles/mapbox/navigation-day-v1', // style URL
    zoom: 4, // starting zoom
    center: [50.356, 28.564] // starting center
});

async function geojsonFetch() {
    let response, oil, ir, iq, kw, sa, ae, table;
    response = await fetch('assets/oil.geojson');
    oil = await response.json();
    response = await fetch('assets/IR_regions.geojson');
    ir = await response.json();
    response = await fetch('assets/IQ_country.geojson');
    iq = await response.json();
    response = await fetch('assets/KW_regions.geojson');
    kw = await response.json();
    response = await fetch('assets/SA_regions.geojson');
    sa = await response.json();
    response = await fetch('assets/AE_regions.geojson');
    ae = await response.json();
    //load data to the map as new layers and table on the side.
    map.on('load', function loadingData() {
        let countries = [ir, iq, kw, sa, ae];
        let countryNames = ['Iran', 'Iraq', 'Kuwait', 'Saudi Arabia', 'United Arab Emirates'];
        let colors = ['#0080ff', '#ff80ff', '#00ff80', '#ff8000', '#ff0080'];
        for (let i = 0; i < countries.length; i++) {
            map.addSource(countryNames[i], {
                type: 'geojson',
                data: countries[i]
            });

            map.addLayer({
                'id': countryNames[i] + '-layer',
                'type': 'fill',
                'source': countryNames[i],
                'paint': {
                    'fill-color': colors[i],
                    'fill-opacity': 0.5
                }
            });
        }
        map.addSource('oil', {
            type: 'geojson',
            data: oil
        });
        map.loadImage('assets/barrel-oil-svgrepo-com.png', function(error, image) {
            if (error) {
                console.log('couldnt load image', error);
            } else {
            map.addImage('oil-barrel', image);
            map.addLayer({
                id: 'oil-layer',
                type: 'symbol',
                source: 'oil',
                layout: {
                    'icon-image': 'oil-barrel',
                    'icon-size': 0.05
                }
            });
        }
    });
});

    table = document.getElementsByTagName("table")[0];
    let row, cell1, cell2, cell3;
    for (let i = 0; i < oil.features.length; i++) {
        // Create an empty <tr> element and add it to the 1st position of the table:
        row = table.insertRow(-1);
        cell1 = row.insertCell(0);
        cell2 = row.insertCell(1);
        cell3 = row.insertCell(2);
        cell1.innerHTML = oil.features[i].properties.name;
        cell2.innerHTML = oil.features[i].properties.capacity_billion_bbl;
        cell3.innerHTML = oil.features[i].properties.current_bpd_million_bbl;
    }
};


geojsonFetch();


let btn = document.getElementsByTagName("button")[0];
let btn2 = document.getElementsByTagName("button")[1];
btn.addEventListener('click', () => sortTable(1));
btn2.addEventListener('click', () => sortTable(2));


// define the function to sort table
function sortTable(index) {
    let table, rows, switching, i, x, y, shouldSwitch;
    console.log('clicked');
    table = document.getElementsByTagName("table")[0];
    switching = true;
    /*Make a loop that will continue until
    no switching has been done:*/
    while (switching) {
        //start by saying: no switching is done:
        switching = false;
        rows = table.rows;
        /*Loop through all table rows (except the
        first, which contains table headers):*/
        for (i = 1; i < (rows.length - 1); i++) {
            //start by saying there should be no switching:
            shouldSwitch = false;
            /*Get the two elements you want to compare,
            one from current row and one from the next:*/
            x = parseFloat(rows[i].getElementsByTagName("td")[index].innerHTML);
            y = parseFloat(rows[i + 1].getElementsByTagName("td")[index].innerHTML);
            //check if the two rows should switch place:
            if (x < y) {
                //if so, mark as a switch and break the loop:
                shouldSwitch = true;
                break;
            }
        }
        if (shouldSwitch) {
            /*If a switch has been marked, make the switch
            and mark that a switch has been done:*/
            rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
            switching = true;
        }
    }
}

