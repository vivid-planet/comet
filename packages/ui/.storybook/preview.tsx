import "@fontsource-variable/figtree";
import "../src/themes/dextinity.css";
import "../src/themes/acme.css";

import type { Preview } from "@storybook/react-vite";

import { colorSchemeOptions, themeDecorator, themeOptions } from "../src/storybook/themeDecorator";

const preview: Preview = {
    tags: ["autodocs"],
    decorators: [themeDecorator],
    globalTypes: {
        theme: {
            description: "Theme the components follow",
            toolbar: {
                title: "Theme",
                icon: "paintbrush",
                items: themeOptions,
                dynamicTitle: true,
            },
        },
        colorScheme: {
            description: "Color scheme of the theme",
            toolbar: {
                title: "Color scheme",
                icon: "contrast",
                items: colorSchemeOptions,
                dynamicTitle: true,
            },
        },
    },
    initialGlobals: {
        theme: "dextinity",
        colorScheme: "light",
    },
    parameters: {
        a11y: {
            // Accessibility violations fail the story's test.
            test: "error",
        },
        controls: {
            sort: "requiredFirst",
        },
        docs: {
            codePanel: true,
        },
        options: {
            storySort: {
                order: ["Introduction", "Foundations", ["Theming", "Design tokens", "Customization"], "Components", "Patterns", "Contributing"],
            },
        },
    },
};

export default preview;
