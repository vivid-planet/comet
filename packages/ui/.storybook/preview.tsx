import "@fontsource-variable/figtree";
import "../src/themes/dextinity.css";
import "../src/themes/sunset.css";
import "../src/themes/acme.css";

import type { Preview } from "@storybook/react-vite";

import { applyToolbarThemeToDocument } from "../src/storybook/documentTheme";
import { colorSchemeOptions, dextinityThemeModes, themeDecorator, themeOptions } from "../src/storybook/themeDecorator";
import { TokenCode } from "../src/storybook/tokenCode";

applyToolbarThemeToDocument();

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
        chromatic: {
            modes: dextinityThemeModes,
        },
        controls: {
            sort: "requiredFirst",
        },
        docs: {
            codePanel: true,
            components: { code: TokenCode },
        },
        options: {
            storySort: {
                order: [
                    "Introduction",
                    "Foundations",
                    ["Theming", "Design tokens", "Theme overview", "Customization"],
                    "Components",
                    "Patterns",
                    "Contributing",
                ],
            },
        },
    },
};

export default preview;
