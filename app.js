import { fetchJson } from "./functions/api.js";
import { createElement } from "./functions/dom.js";
import { TodoList } from "./components/todoList.js"; 

try {
    const todos = await fetchJson(
        "https://jsonplaceholder.typicode.com/todos?_limit=5"
    );
    const list = new TodoList(todos);
    list.appendTo(document.querySelector("#todolist"));
    
} catch (error) {
    const alertElement = createElement(
        "div",
        {
            class: "alert alert-danger m-4",
            role: "alert",
        },
        "Error while fetching data"
    );
    document.body.prepend(alertElement);
    console.error("Fetching data failed", error);
}
