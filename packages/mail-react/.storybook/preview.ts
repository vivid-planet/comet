import { parameters as mailParameters } from "../src/storybook/preview.ts";

export { decorators, initialGlobals } from "../src/storybook/preview.ts";

export const parameters = {
    ...mailParameters,
    layout: "fullscreen",
};
