import { alertElement } from "./functions/alert.js";
import { fetchJson } from "./functions/api.js";

/**
 * Infinite pagination
 * @param {HTMLElement} element - The element to observe
 * @returns {InfinitePagination} The infinite pagination instance
 */
class InfinitePagination {
    /** @type {string} */
    #endpoint;

    /** @type {HTMLTemplateElement}*/
    #template;

    /** @type {HTMLElement} */
    #target;

    /** @type {HTMLElement} */
    #loader;

    /** @type {object} */
    #elements;

    /** @type {IntersectionObserver} */
    #observer;

    /** @type {boolean} */
    #loading = false;

    /** @type {number} */
    #page = 1;

    /**
     * @param {HTMLElement} element
     */
    constructor(element) {
        this.#loader = element;
        this.#endpoint = element.dataset.endpoint;
        this.#template = document.querySelector(element.dataset.template);
        this.#target = document.querySelector(element.dataset.target);
        this.#elements = JSON.parse(element.dataset.elements);
        this.#observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    this.#loadMore();
                }
            });
        });
        this.#observer.observe(element);
    }

    /**
     * Load more comments
     * @returns {void}
     */
    async #loadMore() {
        if (this.#loading) {
            return;
        }
        this.#loading = true;
        try {
            const url = new URL(this.#endpoint);
            url.searchParams.set("_page", this.#page);
            const comments = await fetchJson(url.toString());
            if (comments.length === 0) {
                this.#observer.disconnect();
                this.#loader.remove();
                return;
            }
            comments.forEach((comment) => {
                const commentElement = this.#template.content.cloneNode(true);
                Object.entries(this.#elements).forEach(([key, value]) => {
                    commentElement.querySelector(value).innerText =
                        comment[key];
                });
                this.#target.append(commentElement);
            });
            this.#page++;
            this.#loading = false;
        } catch (e) {
            this.#loader.style.display = "none";
            const error = alertElement(
                "An error occurred while loading comments"
            );
            error.addEventListener("close", () => {
                this.#loader.style.removeProperty("display");
                this.#loading = false;
            });
            this.#target.append(error);
        }
    }
}

/**
 * Fetch form
 * @param {HTMLFormElement} form - The form to observe
 * @returns {FetchForm} The fetch form instance
 */
class FetchForm {
    /** @type {string} */
    #endpoint;

    /** @type {HTMLTemplateElement}*/
    #template;

    /** @type {HTMLElement} */
    #target;

    /** @type {HTMLElement} */
    #loader;

    /** @type {object} */
    #elements;

    constructor(form) {
        this.#endpoint = form.dataset.endpoint;
        this.#template = document.querySelector(form.dataset.template);
        this.#target = document.querySelector(form.dataset.target);
        this.#elements = JSON.parse(form.dataset.elements);
        form.addEventListener("submit", (e) => {
            e.preventDefault();
            this.#submitForm(e.currentTarget);
        });
    }

    /**
     * Submit the form
     * @param {HTMLFormElement} form - The form to submit
     * @returns {void}
     */
    async #submitForm(form) {
        const button = form.querySelector("button");
        button.setAttribute("disabled", "");

        try {
            const data = new FormData(form);
            const comment = await fetchJson(this.#endpoint, {
                method: "POST",
                json: Object.fromEntries(data),
            });

            const commentElement = this.#template.content.cloneNode(true);
            Object.entries(this.#elements).forEach(([key, value]) => {
                commentElement.querySelector(value).innerText = comment[key];
            });
            this.#target.prepend(commentElement);
            form.reset();
            button.removeAttribute("disabled");
            const success = alertElement("Thank you for your comment");
            form.insertAdjacentElement(
                "beforebegin",
                alertElement(success, "success")
            );
            alert.addEventListener("close", () => {
                button.removeAttribute("disabled");
            });
        } catch (e) {
            const error = alertElement(
                "An error occurred while submitting the form"
            );
            form.insertAdjacentElement("beforebegin", alertElement(error));
            alert.addEventListener("close", () => {
                button.removeAttribute("disabled");
            });
        }
    }
}

document.querySelectorAll(".js-infinite-pagination").forEach((element) => {
    new InfinitePagination(element);
});

document.querySelectorAll(".js-form-fetch").forEach((form) => {
    new FetchForm(form);
});
