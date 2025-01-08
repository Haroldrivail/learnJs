/**
 * @param {string} tagName
 * @param {object} attributes
 * @param {string | HTMLElement | HTMLElement[]} contents
 * @returns {HTMLElement}
 */
export function createElement(tagName, attributes = {}, contents) {
    const element = document.createElement(tagName);
    Object.entries(attributes).forEach(([attribute, value]) => {
        if (value !== null) {
            element.setAttribute(attribute, value);
        }
    });

    if (Array.isArray(contents)) {
        contents.forEach((content) => {
            element.append(content);
        });
    } else if (contents instanceof HTMLElement) {
        element.append(contents);
    } else {
        element.innerHTML = contents;
    }

    return element;
}
