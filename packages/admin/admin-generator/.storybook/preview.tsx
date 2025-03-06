import "@fontsource-variable/roboto-flex/full.css";
import { initialize, mswLoader } from "msw-storybook-addon";

import type { Preview } from "@storybook/react";
import { IntlDecorator, LocaleOptions } from "./decorators/IntlDecorator.decorator";
import { ThemeOptions, ThemeProviderDecorator } from "./decorators/ThemeProvider.decorator";
import { LayoutDecorator, LayoutOptions } from "./decorators/Layout.decorator";
import { ApolloProviderDecorator } from "./decorators/ApolloProvider.decorator";
import { ErrorBoundaryDecorator } from "./decorators/ErrorBoundary.decorator";
import { routerDecorator, storyRouterDecorator } from "./decorators/Router.decorator";

// Initialize MSW
initialize();

export const globalTypes = {
    locale: {
        name: "Locale",
        description: "Internationalization locale",
        defaultValue: LocaleOptions.English,
        toolbar: {
            icon: "globe",
            items: [
                { value: LocaleOptions.English, title: "English", right: "🇺🇸" },
                { value: LocaleOptions.German, title: "Deutsch", right: "🇩🇪" },
                { value: LocaleOptions.Ids, title: "Ids", right: "🔢" },
            ],
            showName: true,
            dynamicTitle: true,
        },
    },
    theme: {
        description: "Global theme for components",
        defaultValue: ThemeOptions.Comet,
        toolbar: {
            title: "Theme",
            icon: "paintbrush",
            items: [
                { value: ThemeOptions.Comet, right: "🟩", title: "Comet Theme" },
                { value: ThemeOptions.Mui, right: "🟦", title: "Mui Theme" },
            ],
            showName: true,
            dynamicTitle: true,
        },
    },
    layout: {
        description: "Layout",
        defaultValue: LayoutOptions.Padded,
        toolbar: {
            title: "Layout",
            icon: "switchalt",
            items: [
                { value: LayoutOptions.Padded, title: "Padded" },
                { value: LayoutOptions.Default, title: "Default" },
            ],
            showName: true,
            dynamicTitle: true,
        },
    },
};

export default {
    tags: ["autodocs"],
    decorators: [ThemeProviderDecorator, ErrorBoundaryDecorator, ApolloProviderDecorator, IntlDecorator, LayoutDecorator, storyRouterDecorator()],
    parameters: {
        controls: {
            matchers: {
                color: /(background|color)$/i,
                date: /Date$/i,
            },
        },
    },
    loaders: [mswLoader],
} satisfies Preview;
