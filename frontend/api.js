const BASE_URL = "http://localhost:5000";

export async function fetchStates() {
    const res = await fetch(`${BASE_URL}/states`);
    return res.json();
}

export async function fetchExperiences() {
    const res = await fetch(`${BASE_URL}/experiences`);
    return res.json();
}

export async function fetchDestinationsByState(state) {
    const res = await fetch(`${BASE_URL}/destinations/state/${state}`);
    return res.json();
}

export async function fetchStateDetails(state) {
    const res = await fetch(`${BASE_URL}/state/${state}`);
    return res.json();
}

export async function fetchExperienceDetails(exp) {
    const res = await fetch(`${BASE_URL}/experience/${exp}`);
    return res.json();
}
