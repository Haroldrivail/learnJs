/**
 * Creates an HTML element
 * @param {string} tagName
 * @param {object} attributes
 * @param {string | HTMLElement | HTMLElement[]} contents
 * @returns {HTMLElement}
 */
export function createElement(tagName, attributes = {}, contents) {
    const element = document.createElement(tagName);
    Object.entries(attributes).forEach(([attribute, value]) => {
        if (value !== null) {
            if (attribute.startsWith("on") && typeof value === "function") {
                element[attribute] = value;
            } else {
                element.setAttribute(attribute, value);
            }
        }
    });

    if (Array.isArray(contents)) {
        contents.forEach((content) => {
            element.append(content);
        });
    } else if (contents instanceof HTMLElement) {
        if (contents !== null && contents !== undefined) {
            element.append(contents);
        }
    } else {
        element.textContent = contents;
    }
}

/**
 * Clones a template
 * @param {string} templateId
 * @returns {DocumentFragment}
 */
export function cloneTemplate(templateId) {
    return document.getElementById(templateId).content.cloneNode(true);
}
