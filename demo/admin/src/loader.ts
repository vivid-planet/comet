import App from "./App";

const loadHtml = () => {
    const rootElement = document.querySelector<HTMLElement>("#root");
    if (!rootElement) return false;

    App.render(rootElement);
};

if (["interactive", "complete"].indexOf(document.readyState) !== -1) {
    loadHtml();
} else {
    document.addEventListener("DOMContentLoaded", loadHtml, false);
}
