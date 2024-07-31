// Initialize the map
let map;

// Function to build the map
function buildMap(coords) {
    map = L.map('map').setView([coords[0], coords[1]], 13);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        minZoom: 12,
    }).addTo(map);

    L.marker([coords[0], coords[1]]).addTo(map)
        .bindPopup('You are here')
        .openPopup();
}

// Function to get coordinates via geolocation API
async function getCoords() {
    const pos = await new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject);
    });
    return [pos.coords.latitude, pos.coords.longitude];
}

// Function to get Foursquare businesses
async function getFoursquare(business, coords) {
    const options = {
        method: 'GET',
        headers: {
            Accept: 'application/json',
            Authorization: 'fsq3ATzZbmcGhdeFafr73wZcnJ+LlN6bK+4dh19a7ClS4u8='
        }
    };
    const limit = 5;
    const lat = coords[0];
    const lon = coords[1];
    const response = await fetch(`https://api.foursquare.com/v3/places/search?&query=${business}&limit=${limit}&ll=${lat}%2C${lon}`, options);
    const data = await response.json();
    return data.results;
}

// Function to process Foursquare array
function processBusinesses(data) {
    return data.map(element => ({
        name: element.name,
        lat: element.geocodes.main.latitude,
        long: element.geocodes.main.longitude
    }));
}

// Function to add markers to the map
function addMarkers(businesses) {
    businesses.forEach(business => {
        L.marker([business.lat, business.long])
            .bindPopup(`<p1>${business.name}</p1>`)
            .addTo(map);
    });
}

// Event handler for window load
window.onload = async () => {
    const coords = await getCoords();
    buildMap(coords);
};

// Event handler for business submit button
document.getElementById('submit').addEventListener('click', async (event) => {
    event.preventDefault();
    const business = document.getElementById('business').value;
    const coords = await getCoords();
    const data = await getFoursquare(business, coords);
    const businesses = processBusinesses(data);
    addMarkers(businesses);
});