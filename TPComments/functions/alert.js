/**
 * Create an alert element
 * @param {string} message - The message to display
 * @param {string} type - The type of the alert
 * @returns {HTMLElement} The alert element
 */
export function alertElement(message, type = "danger") {
    /** @type {HTMLElement} */
    const el = document
        .querySelector("#alert")
        .content.firstElementChild.cloneNode(true);
    el.classList.add(`alert-${type}`);
    el.querySelector(".js-text").innerText = message;
    el.querySelector("button").addEventListener("click", (e) => {
        e.preventDefault();
        el.remove();
        el.dispatchEvent(new CustomEvent("close"));
    });
    return el;
}
