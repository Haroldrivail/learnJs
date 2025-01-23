/**
 * Fetches JSON data from the specified URL.
 * @param {string} url - The URL to fetch the data from.
 * @param {RequestInit & { json?: object }} options - The options for the fetch request.
 * @returns {Promise<object>} A promise that resolves to the JSON data.
 */
export async function fetchJson(url, options = {}) {
    if (options.json) {
        options.body = JSON.stringify(options.json);
        headers: ["Content-Type"] = "application/json";
    }
    const headers = { Accept: "application/json", ...options.headers };
    const response = await fetch(url, { ...options, headers });
    if (response.ok) {
        return response.json();
    }
    throw new Error("Error while fetching data at the api", {
        cause: response,
    });
}
