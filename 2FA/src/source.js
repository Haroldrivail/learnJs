/**
 * Personnalized Element
 * More information : https://grafikart.fr/tutoriels/web-component-1201
 */
class CodeInput extends HTMLElement {
    /** @type {HTMLInputElement[]} - Input elements */
    #inputs = [];

    /** @type {HTMLInputElement | null} - Hidden input element */
    #hiddenInput = null;

    static get observedAttributes() {
        return ["value"];
    }

    connectedCallback() {
        const legend = this.getAttribute("legend") ?? "Enter your 6-digit code";
        const size = parseInt(this.getAttribute("size") ?? "6", 10);
        const name = this.getAttribute("name") ?? "";
        const value = this.getAttribute("value") ?? "";

        this.innerHTML = `
        <fieldset>
            <legend>${legend}</legend>
            <div class="code-inputs">
                ${Array.from(
                    { length: size },
                    (_, k) => `<input 
                    type="text" 
                    inputmode="numeric" 
                    aria-label="Digit ${k}" 
                    pattern="[0-9]{1}"
                    value="${value.slice(k, k + 1)}"
                    required >`
                ).join("")}
            </div>
            <input type="hidden" name="${name}" value="${value}">
        </fieldset>
        `;
        this.#hiddenInput = this.querySelector('input[type="hidden"]');
        this.#inputs = Array.from(this.querySelectorAll('input[type="text"]'));
        this.#inputs.forEach((input) => {
            input.addEventListener("paste", this.#onPaste.bind(this));
            input.addEventListener("input", this.#onInput.bind(this));
            input.addEventListener("keydown", this.#onKeyDown.bind(this));
        });
    }

    /**
     * Attribute changed callback
     * @param {string} name - Name of the attribute
     * @param {string} oldValue - Old value of the attribute
     * @param {string} newValue - New value of the attribute
     * @returns {void}
     * */
    attributeChangedCallback(name, oldValue, newValue) {
        if (name === "value") {
            this.value = newValue;
        }
    }

    /** @param {string | null} - Value of the input */
    set value(string) {
        if (!this.#inputs || !this.#inputs.length <= 0) {
            return;
        }
        const value = string ?? "";
        this.#inputs.forEach((input, k) => {
            input.value = value[k] ?? "";
        });
        this.#updateHiddenInput();
    }

    /**
     * Input event handler
     * @param {InputEvent} e - Input event
     * @returns {void}
     * */
    #onInput(e) {
        e.currentTarget.value = e.currentTarget.value
            .replaceAll(/\D/g, "")
            .slice(0, 1);
        this.#updateHiddenInput();
    }

    /**
     * Key down event handler
     * @param {KeyboardEvent} e - Keyboard event
     * @returns {void}
     * */
    #onKeyDown(e) {
        if (e.key.match(/\d/)) {
            e.preventDefault();
            e.currentTarget.value = e.key;
            const nextInput = e.currentTarget.nextElementSibling;
            if (nextInput) {
                nextInput.focus();
            }
            this.#updateHiddenInput();
        }

        if (e.key === "Backspace" && e.currentTarget.value === "") {
            e.currentTarget.value = "";
            const previousInput = e.currentTarget.previousElementSibling;
            if (previousInput) {
                previousInput.value = "";
                previousInput.focus();
                this.#updateHiddenInput();
            }
            return;
        }
    }

    /**
     * Update hidden input value
     * @returns {void}
     * */
    #updateHiddenInput() {
        this.#hiddenInput.value = this.#inputs
            .map((input) => input.value)
            .join("");
    }

    /**
     * Paste event handler
     * @param {ClipboardEvent} e - Clipboard event
     * @returns {void}
     * */
    #onPaste(e) {
        e.preventDefault();
        const index = this.#inputs.findIndex(
            (input) => input === e.currentTarget
        );
        const text = e.clipboardData.getData("text").replaceAll(/\D/g, "");

        if (text.length === 0) {
            return;
        }
        let lastInput;
        this.#inputs.slice(index).forEach((input, k) => {
            if (!text[k]) {
                return;
            }
            input.value = text[k];
            lastInput = input;
        });
        const nextAfterLastInput = lastInput.nextElementSibling;
        if (nextAfterLastInput) {
            nextAfterLastInput.focus();
        } else {
            lastInput.focus();
        }
        this.#updateHiddenInput();
    }
}

customElements.define("code-input", CodeInput);
