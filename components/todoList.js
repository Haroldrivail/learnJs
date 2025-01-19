import { cloneTemplate } from "../functions/dom.js";

/**
 * Represents a list of todo items.
 * @typedef {object} Todo
 * @property {string} id - The unique identifier for the todo item.
 * @property {string} title - The title of the todo item.
 * @property {boolean} completed - Whether the todo item is completed or not.
 */

export class TodoList {
    /**
     * The HTML element that contains the list of todo items.
     * @type {HTMLUListElement}
     */
    #listElement = null;

    /**
     *  An array of Todo objects.
     *  @type {Todo[]}
     */
    #todos = [];

    /**
     * Creates a new TodoList instance.
     * @param {Todo[]} todos - An array of Todo objects
     */
    constructor(todos) {
        this.#todos = todos;
    }

    /**
     * Appends the todo list to the specified HTML element.
     *
     * @param {HTMLElement} element - The HTML element to append the todo list to.
     * @returns {void}
     */
    appendTo(element) {
        element.append(cloneTemplate("todolist-layout"));

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

        this.#listElement.addEventListener(
            "remove-todo",
            ({ detail: todo }) => {
                this.#todos = this.#todos.filter((t) => t.id !== todo.id);
                this.#onUpdate();
            }
        );

        this.#listElement.addEventListener(
            "toggle-todo",
            ({ detail: todo }) => {
                todo.completed = !todo.completed;
                this.#onUpdate();
            }
        );
    }

    /**
     * Handles the form submission to add a new todo item.
     * @param {SubmitEvent} e - The submit event object.
     * @returns {void}
     */
    #onSubmit(e) {
        e.preventDefault();
        const form = e.target.closest("form");
        const titleField = new FormData(form).get("title");
        const title = titleField ? titleField.toString().trim() : "";
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
        this.#todos.push(todo);
        this.#onUpdate();
        form.reset();
    }

    /**
     * Updates the local storage with the current todo list.
     * This is called when the todo list is modified.
     * @returns {void}
     */
    #onUpdate() {
        localStorage.setItem("todos", JSON.stringify(this.#todos));
    }

    /**
     * Toggles the visibility of todo items based on their completion status.
     * @param {PointerEvent} e - The event object.
     * @returns {void}
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

/**
 * Represents a single todo item in the todo list.
 * @property {Todo} todo - The todo object associated with the todo list item.
 * @property {HTMLLIElement} element - The HTML element representing the todo list item.
 * @method toggle - Change the state of the todo item
 * @method remove - Removes the todo item from the list.
 * @constructor TodoListItem - Creates a new TodoListItem instance.
 * @returns {TodoListItem} The todo list item instance.
 */
class TodoListItem {
    #element = null;
    #todo = null;

    /**
     * @param {Todo} todo - The todo object to create the todo list item for.
     * @type {Todo} todo - The todo object associated with the todo list item.
     */
    constructor(todo) {
        this.#todo = todo;
        const id = `todo-${todo.id}`;
        const li = cloneTemplate("todolist-item").firstElementChild;
        this.#element = li;

        const checkbox = li.querySelector("input");
        checkbox.setAttribute("id", id);
        if (todo.completed) {
            checkbox.setAttribute("checked", "");
        }

        const label = li.querySelector("label");
        label.setAttribute("for", id);
        label.innerText = todo.title;

        const button = li.querySelector("button");

        this.toggle(checkbox);

        button.addEventListener("click", (e) => {
            this.remove(e);
        });

        checkbox.addEventListener("change", (e) => {
            this.toggle(e.currentTarget);
        });
    }

    /**
     * Returns the HTML element representing the todo list item.
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
        const event = new CustomEvent("toggle-todo", {
            detail: this.#todo,
            bubbles: true,
        });
        this.#element.dispatchEvent(event);
    }

    /**
     * Removes the todo item from the list.
     * @param {Event} e - The event object.
     */
    remove(e) {
        e.preventDefault();
        const event = new CustomEvent("remove-todo", {
            detail: this.#todo,
            bubbles: true,
            cancelable: true,
        });
        this.#element.dispatchEvent(event);
        this.#element.remove();
    }
}
