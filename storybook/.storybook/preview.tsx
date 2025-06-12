import "@fontsource-variable/roboto-flex/full.css";

import { MainContent } from "@comet/admin";
import { GlobalStyles } from "@mui/material";
import type { Preview } from "@storybook/react";
import type { GlobalTypes } from "@storybook/types";

import { IntlDecorator, LocaleOptions } from "./decorators/IntlProvider.decorator";
import { ThemeOptions, ThemeProviderDecorator } from "./decorators/ThemeProvider.decorator";
import { worker } from "./mocks/browser";
import { previewGlobalStyles } from "./preview.styles";

export const globalTypes: GlobalTypes = {
    theme: {
        description: "Global MUI Theme",
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
    locale: {
        name: "Locale",
        description: "Locale",
        toolbar: {
            title: "Locale",
            icon: "globe",
            items: [
                { value: LocaleOptions.English, title: "English", right: "🇺🇸" },
                { value: LocaleOptions.German, title: "Deutsch", right: "🇩🇪" },
            ],
            showName: true,
            dynamicTitle: true,
        },
    },
};

const preview: Preview = {
    decorators: [
        ThemeProviderDecorator,
        IntlDecorator,
        (Story, context) => {
            return (
                <>
                    <GlobalStyles styles={previewGlobalStyles} />
                    <>
                        {context.parameters.layout === "padded" ? (
                            <MainContent>
                                <Story />
                            </MainContent>
                        ) : (
                            <Story />
                        )}
                    </>
                </>
            );
        },
    ],
    parameters: {
        layout: "padded",
        options: {
            /**
             * Note: according to: https://storybook.js.org/docs/writing-stories/naming-components-and-hierarchy#sorting-stories
             * the `storySort` function gets injected as javascript. Adding types is not possible
             */
            storySort: (
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-expect-error
                a,
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-expect-error
                b,
            ) => {
                const orderGettingStarted = [
                    "docs-getting-started-installation",
                    "docs-getting-started-structure",
                    "docs-getting-started-develop-in-project",
                    "docs-getting-started-how-to-write-stories",
                    "docs-getting-started",
                ];
                const orderComponents = [
                    "docs-components-master",
                    "docs-components-menu",
                    "docs-components-appheader",
                    "docs-components-toolbar",
                    "docs-components-table",
                    "docs-components-stack",
                    "docs-components-edit-dialog",
                    "docs-components-error-handling",
                    "docs-components-router",
                    "docs-components-router-tabs",
                    "docs-components-selection",
                    "docs-components-datagrid",
                    "docs-components-color-picker",
                    "docs-components-date-picker",
                    "docs-components-react-select",
                    "docs-components-rich-text-editor",
                    "docs-components",
                ];
                const orderForm = [
                    "docs-form-overview",
                    "docs-form-validation",
                    "docs-form-layout",
                    "docs-form-components-date-time-pickers",
                    "docs-form-components-finalform",
                    "docs-form-components-fieldcontainer",
                    "docs-form-components-field",
                    "docs-form-components-formsection",
                    "docs-form-components-finalform-fields",
                    "docs-form-components",
                ];
                const orderHooks = ["docs-hooks-hooks", "docs-hooks"];
                const orderHelper = ["docs-helper-clipboard"];
                const orderIcons = ["docs-icons-all-icons", "docs-icons-usage", "docs-icons"];
                const orderBestPractices = ["docs-best-practices-overview", "docs-best-theme-and-styling", "docs-best-practices"];
                const orderDevelopment = ["docs-development-overview", "docs-development-create-a-component-with-theme-support", "docs-development"];

                const order = [
                    "docs-intro-",
                    ...orderGettingStarted,
                    ...orderComponents,
                    ...orderForm,
                    ...orderHooks,
                    ...orderHelper,
                    ...orderIcons,
                    ...orderBestPractices,
                    ...orderDevelopment,
                    "admin-",
                    "comet-",
                    "stories-",
                ];

                const aName = a.id;
                const bName = b.id;

                const aIdx = order.findIndex((i) => aName.indexOf(i) > -1);
                const bIdx = order.findIndex((i) => bName.indexOf(i) > -1);
                return aIdx - bIdx;
            },
        },
    },
};

export default preview;

worker.start();
