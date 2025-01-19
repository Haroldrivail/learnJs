/**
 * Sets a cookie with the specified name, value, and days.
 * @param {string} name - The name of the cookie.
 * @param {string} value - The value of the cookie.
 * @param {number} days - The number of days the cookie should be valid for.
 * @returns {void}
 */
function setCookie(name, value, days) {
    const expires = new Date();
    expires.setDate(expires.getDate() + days);
    document.cookie = `${name}=${encodeURIComponent(
        value
    )}; expires=${expires.toUTCString()}; path=/`;
}

/**
 * Gets the value of the cookie with the specified name.
 * @param {string} name - The name of the cookie.
 * @returns {string | null} The value of the cookie or null if the cookie doesn't exist.
 */
function getCookie(name) {
    const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
    if (match) {
        return decodeURIComponent(match[2]);
    }
    return null;
}


const COOKIE_NAME = "name";
const COOKIE_VALUE = "value";
const COOKIE_AGE = "age";
const COOKIE_AGE_VALUE = "25";
const COOKIE_EXPIRY_DAYS = 1;
setCookie(COOKIE_NAME, COOKIE_VALUE, COOKIE_EXPIRY_DAYS);
setCookie(COOKIE_AGE, COOKIE_AGE_VALUE, COOKIE_EXPIRY_DAYS);

console.log(`The cookie "name" has value: ${getCookie("name")}`);
console.log(`The cookie "age" has value: ${getCookie("age")}`);