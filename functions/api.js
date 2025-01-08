export async function fetchJson(url, options = {}) {
    const headers = { Accept: "application/json", ...options.headers };
    const response = await fetch(url, { ...options, headers });
    if (response.ok) {
        return response.json();
    }
    throw new Error("Error while fetching data at the api", { cause: response });
}
