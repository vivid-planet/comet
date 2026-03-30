import type { Preview } from "@storybook/react-webpack5";
import { type GlobalTypes } from "storybook/internal/csf";

import { IntlDecorator, LocaleOption } from "./decorators/IntlProvider.decorator";
import { LayoutDecorator, LayoutOption } from "./decorators/Layout.decorator";
import { ThemeOption, ThemeProviderDecorator } from "./decorators/ThemeProvider.decorator";

export const globalTypes: GlobalTypes = {
    theme: {
        description: "Global MUI Theme",
        toolbar: {
            title: "Theme",
            icon: "paintbrush",
            items: [
                { value: ThemeOption.Comet, right: "🟩", title: "Comet Theme" },
                { value: ThemeOption.Mui, right: "🟦", title: "Mui Theme" },
            ],
            dynamicTitle: true,
        },
    },
    locale: {
        name: "Locale",
        description: "Locale",
        toolbar: {
            title: "Locale",
            icon: "globe",
            items: [
                { value: LocaleOption.English, title: "English", right: "🇺🇸" },
                { value: LocaleOption.German, title: "German", right: "🇩🇪" },
            ],
            dynamicTitle: true,
        },
    },
    layout: {
        description: "Layout",
        toolbar: {
            title: "Layout",
            icon: "switchalt",
            items: [
                { value: LayoutOption.Padded, title: "Padded" },
                { value: LayoutOption.Default, title: "Default" },
            ],
            dynamicTitle: true,
        },
    },
};

const preview: Preview = {
    tags: ["autodocs"],
    decorators: [ThemeProviderDecorator, IntlDecorator, LayoutDecorator],

    parameters: {
        docs: {
            codePanel: true,
        },
        controls: {
            matchers: {
                color: /(background|color)$/i,
                date: /Date$/i,
            },
        },
    },
};

export default preview;
