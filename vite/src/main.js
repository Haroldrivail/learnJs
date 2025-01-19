import "./style.css";

import { setupCounter } from "./counter.js";

import('./counter.js').then((module) => {
    module.setupCounter(document.querySelector("button"));
});
