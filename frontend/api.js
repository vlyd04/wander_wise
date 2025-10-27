const BASE_URL = "http://localhost:5000";

export async function fetchStates() {
    const res = await fetch(`${BASE_URL}/states`);
    return res.json();
}


// Fetch destinations using OpenTripMap API via backend
export async function fetchDestinations({ city, lon, lat, radius }) {
    let url = `${BASE_URL}/api/destinations?`;
    if (city) url += `city=${encodeURIComponent(city)}`;
    if (lon && lat) url += `&lon=${lon}&lat=${lat}`;
    if (radius) url += `&radius=${radius}`;
    const res = await fetch(url);
    return res.json();
}

// Fetch experiences using OpenTripMap API via backend
export async function fetchExperiences({ city, lon, lat, radius }) {
    let url = `${BASE_URL}/api/experiences?`;
    if (city) url += `city=${encodeURIComponent(city)}`;
    if (lon && lat) url += `&lon=${lon}&lat=${lat}`;
    if (radius) url += `&radius=${radius}`;
    const res = await fetch(url);
    return res.json();
}
