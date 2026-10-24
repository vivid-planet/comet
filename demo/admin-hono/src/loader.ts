import { createElement } from "react";
import { createRoot } from "react-dom/client";

import { App } from "./App";

const rootElement = document.querySelector<HTMLElement>("#root");
if (rootElement) {
    createRoot(rootElement).render(createElement(App));
}
