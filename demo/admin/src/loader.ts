import { createElement } from "react";
import { render } from "react-dom";

import { App } from "./App";

const loadHtml = () => {
    const rootElement = document.querySelector<HTMLElement>("#root");
    if (!rootElement) return false;

    render(createElement(App), rootElement);
};

if (["interactive", "complete"].includes(document.readyState)) {
    loadHtml();
} else {
    document.addEventListener("DOMContentLoaded", loadHtml, false);
}
