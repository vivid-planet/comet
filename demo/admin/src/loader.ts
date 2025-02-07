import { createElement } from "react";
import { createRoot } from "react-dom/client";

import { App } from "./App";

const loadHtml = () => {
    const rootElement = document.querySelector<HTMLElement>("#root");
    if (!rootElement) {
        throw new Error("Comet: root element not found in html - can not render Application");
    }

    const root = createRoot(rootElement);
    root.render(createElement(App));
};

if (["interactive", "complete"].includes(document.readyState)) {
    loadHtml();
} else {
    document.addEventListener("DOMContentLoaded", loadHtml, false);
}
