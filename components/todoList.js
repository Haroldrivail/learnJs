import { createElement } from "../functions/dom.js";

/**
 * @typedef {object} Todo
 * @property {string} id
 * @property {string} title
 * @property {boolean} completed
 */

export class TodoList {
    /**@type {HTMLUListElement} */
    #listElement = null;

    /**@type {Todo[]} */
    #todos = [];

    /**
     * @param {Todo[]} todos
     */
    constructor(todos) {
        this.#todos = todos;
    }

    /**
     *
     * @param {HTMLElement} element
     */
    appendTo(element) {
        element.innerHTML = `<form class="d-flex pb-4" data-testid="todo-form">
                <input
                    required=""
                    class="form-control"
                    type="text"
                    placeholder="Acheter des patates..."
                    name="title"
                />
                <button class="btn btn-primary">Ajouter</button>
            </form>
            <main>
                <div class="btn-group mb-4 filter" role="group" data-testid="filter-buttons">
                    <button
                        type="button"
                        class="btn btn-outline-primary active"
                        data-filter="all"
                    >
                        Toutes
                    </button>
                    <button
                        type="button"
                        class="btn btn-outline-primary"
                        data-filter="todo"
                    >
                        A faire
                    </button>
                    <button
                        type="button"
                        class="btn btn-outline-primary"
                        data-filter="done"
                    >
                        Faites
                    </button>
                </div>

                <ul class="list-group" data-testid="todo-list">
                </ul>
            </main>`;
        this.#listElement = element.querySelector(".list-group");

        for (let todo of this.#todos) {
            const item = new TodoListItem(todo);
            this.#listElement.append(item.element);
        }

        element
            .querySelector("form")
            .addEventListener("submit", (e) => this.#onSubmit(e));
        element.querySelectorAll(".btn-group button").forEach((button) => {
            button.addEventListener("click", (e) => this.#toggleFilter(e));
        });
    }

    /**
     * @param {SubmitEvent} e
     */
    #onSubmit(e) {
        e.preventDefault();
        const form = e.currentTarget;
        const title = new FormData(form).get("title").toString().trim();
        if (title === "") {
            return;
        }

        const todo = {
            id: Date.now(),
            title,
            completed: false,
        };
        const item = new TodoListItem(todo);
        this.#listElement.prepend(item.element);
        form.reset();
    }

    /**
     * @param {PointerEvent} e
     */
    #toggleFilter(e) {
        e.preventDefault();
        const target = e.currentTarget;
        const filter = target.getAttribute("data-filter");

        target.parentElement
            .querySelector(".active")
            .classList.remove("active");
        target.classList.add("active");

        if (filter === "todo") {
            this.#listElement.classList.add("hide-completed");
            this.#listElement.classList.remove("hide-todo");
        } else if (filter === "done") {
            this.#listElement.classList.add("hide-todo");
            this.#listElement.classList.remove("hide-completed");
        } else {
            this.#listElement.classList.remove("hide-todo");
            this.#listElement.classList.remove("hide-completed");
        }
    }
}

class TodoListItem {
    #element;

    /**@type {Todo}*/
    constructor(todo) {
        const id = `todo-${todo.id}`;

        const checkbox = createElement(
            "input",
            {
                class: "form-check-input",
                type: "checkbox",
                id,
                checked: todo.completed ? "" : null,
            },
            ""
        );

        const label = createElement(
            "label",
            {
                class: "ms-2 form-check-label",
                for: id,
            },
            todo.title
        );

        const deleteButton = createElement(
            "button",
            {
                class: "ms-auto btn btn-danger btn-sm",
                "data-testid": `delete-button-${todo.id}`,
            },
            createElement("i", { class: "bi-trash" }, "")
        );

        const li = createElement(
            "li",
            {
                class: "todo list-group-item d-flex align-items-center is-completed",
                "data-testid": `todo-item-${todo.id}`,
            },
            [checkbox, label, deleteButton]
        );

        this.#element = li;

        this.toggle(checkbox);

        deleteButton.addEventListener("click", (e) => {
            this.remove(e);
        });

        checkbox.addEventListener("change", (e) => {
            this.toggle(e.currentTarget);
        });
    }

    /**
     * @returns {HTMLLIElement}
     */
    get element() {
        return this.#element;
    }

    /**
     * Change the state of the todo item
     * @param {HTMLInputElement} checkbox
     */
    toggle(checkbox) {
        if (checkbox.checked) {
            this.#element.classList.add("is-completed");
        } else {
            this.#element.classList.remove("is-completed");
        }
    }

    /**
     * @param {Event} e
     */
    remove(e) {
        e.preventDefault();
        this.#element.remove();
    }
}
