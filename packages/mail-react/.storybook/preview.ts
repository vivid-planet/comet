import { parameters as mailParameters } from "../src/storybook/preview.js";

export { decorators, initialGlobals } from "../src/storybook/preview.js";

export const parameters = {
    ...mailParameters,
    layout: "fullscreen",
};
