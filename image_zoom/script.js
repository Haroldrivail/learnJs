import { clamp } from "./functions/math.js";

class ProductViewer {
    /** @type {HTMLImageElement} */
    #mediumImage;
    /** @type {HTMLImageElement} */
    #largeImage;
    /** @type {HTMLElement} */
    #thumbnailWrapper;
    /** @type {HTMLElement} */
    #zoomElement;
    /** @type {HTMLElement} */
    #element;
    /** @type {HTMLElement} */
    #magnifier;
    /** @type {string} */
    #largeImageSrc;
    /** @type {{width: number, height: number}} */
    #ratio = { width: 0, height: 0 };

    /** @type {HTMLImageElement} */
    constructor(element) {
        this.#mediumImage = element.querySelector(".js-image-medium");
        this.#thumbnailWrapper = element.querySelector(".js-images");
        this.#zoomElement = element.querySelector(".js-zoom");
        this.#largeImage = element.querySelector(".js-image-large");
        this.#magnifier = element.querySelector(".js-magnifier");
        this.#element = element;

        const images = this.#thumbnailWrapper.querySelectorAll("a");
        this.#largeImageSrc = images[0].getAttribute("href");
        images.forEach((image) => {
            image.addEventListener("click", this.#onThumbnailClick.bind(this));
        });
        this.#mediumImage.addEventListener(
            "mouseenter",
            this.#onMouseEnter.bind(this)
        );
        this.#mediumImage.addEventListener(
            "mouseleave",
            this.#onMouseLeave.bind(this)
        );
        this.#mediumImage.addEventListener(
            "mousemove",
            this.#onMouseMove.bind(this)
        );
        this.#largeImage.addEventListener("load", this.#updateRatio.bind(this));
    }

    /**
     * @param {PointerEvent} e - click event
     */
    #onThumbnailClick(e) {
        e.preventDefault();
        this.#thumbnailWrapper
            .querySelector(".active")
            ?.classList.remove("active");
        e.target.classList.add("active");
        const medium = e.currentTarget.dataset.medium;
        this.#mediumImage.src = medium;
        this.#largeImageSrc = e.currentTarget.getAttribute("href");
    }

    /**
     * @param {PointerEvent} e - mouse enter event
     */
    #onMouseEnter(e) {
        this.#zoomElement.classList.add("active");
        const rect = this.#mediumImage.getBoundingClientRect();
        this.#largeImage.setAttribute("src", this.#largeImageSrc);
        this.#element.classList.remove("image-loaded");
        this.#zoomElement.style.setProperty(
            "--left",
            `${rect.x + rect.width + 20}px`
        );
    }

    /**
     * @param {PointerEvent} e - mouse enter event
     */
    #onMouseLeave() {
        this.#zoomElement.classList.remove("active");
    }

    /**
     * @param {PointerEvent} e - mouse enter event
     */
    #onMouseMove(e) {
        const cursorRatio = {
            x: e.offsetX / this.#mediumImage.offsetWidth,
            y: e.offsetY / this.#mediumImage.offsetHeight,
        };

        const magnifierRatio = {
            x: clamp(
                cursorRatio.x - this.#ratio.width / 2,
                0,
                1 - this.#ratio.width
            ),
            y: clamp(
                cursorRatio.y - this.#ratio.height / 2,
                0,
                1 - this.#ratio.height
            ),
        };

        this.#magnifier.style.setProperty(
            "transform",
            `translate3d(${magnifierRatio.x * this.#mediumImage.width}px, ${
                magnifierRatio.y * this.#mediumImage.height
            }px, 0)`
        );
        this.#largeImage.style.setProperty(
            "transform",
            `translate3d(-${magnifierRatio.x * 100}%, -${
                magnifierRatio.y * 100
            }%, 0)`
        );
    }

    #updateRatio() {
        const zoomRect = this.#zoomElement.getBoundingClientRect();
        this.#ratio = {
            width: zoomRect.width / this.#largeImage.width,
            height: zoomRect.height / this.#largeImage.height,
        };
        this.#magnifier.style.setProperty(
            "width",
            `${this.#ratio.width * 100}%`
        );
        this.#magnifier.style.setProperty(
            "height",
            `${this.#ratio.height * 100}%`
        );

        this.#element.classList.add("image-loaded");
    }
}

document.querySelectorAll(".js-product").forEach((element) => {
    new ProductViewer(element);
});
