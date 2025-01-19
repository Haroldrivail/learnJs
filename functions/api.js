/**
 * Fetches JSON data from the specified URL.
 * @param {string} url - The URL to fetch the data from.
 * @param {object} options - The options to pass to the fetch function.
 * @returns {Promise<object>} A promise that resolves to the JSON data.
 */
export async function fetchJson(url, options = {}) {
    const headers = { Accept: "application/json", ...options.headers };
    const response = await fetch(url, { ...options, headers });
    if (response.ok) {
        return response.json();
    }
    throw new Error("Error while fetching data at the api", {
        cause: response,
    });
}
