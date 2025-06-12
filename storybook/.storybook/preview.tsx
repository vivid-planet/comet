import "@fontsource-variable/roboto-flex/full.css";

import { MainContent } from "@comet/admin";
import { DateFnsLocaleProvider } from "@comet/admin-date-time";
import { GlobalStyles } from "@mui/material";
import type { Preview } from "@storybook/react-webpack5";
import { type Locale as DateFnsLocale } from "date-fns";
import { de as deLocale, enUS as enLocale } from "date-fns/locale";
import { IntlProvider } from "react-intl";
import { type GlobalTypes } from "storybook/internal/csf";

import { ThemeOptions, ThemeProviderDecorator } from "./decorators/ThemeProvider.decorator";
import { worker } from "./mocks/browser";
import { previewGlobalStyles } from "./preview.styles";

type LocaleKey = "de" | "en";

const dateFnsLocales: Record<LocaleKey, DateFnsLocale> = {
    de: deLocale,
    en: enLocale,
};

// @TODO: use messages from lang-package
const messages = {
    en: {
        "comet.core.deleteMutation.promptDelete": "Delete data?",
        "comet.core.deleteMutation.yes": "Yes",
        "comet.core.deleteMutation.no": "No",
        "comet.core.dirtyHandler.discardChanges": "Discard unsaved changes?",
        "comet.core.editDialog.edit": "Edit",
        "comet.core.editDialog.add": "Add",
        "comet.core.editDialog.cancel": "Cancel",
        "comet.core.editDialog.save": "Save",
        "comet.core.finalForm.abort": "Cancel",
        "comet.core.finalForm.save": "Save",
        "comet.core.router.confirmationDialog.confirm": "OK",
        "comet.core.router.confirmationDialog.abort": "Cancel",
        "comet.core.stack.stack.back": "Back",
        "comet.core.table.addButton": "Add",
        "comet.core.table.excelExportButton": "Export",
        "comet.core.table.deleteButton": "Delete",
        "comet.core.table.pagination.pageInfo": "Page {current} of {total}",
        "comet.core.table.localChangesToolbar.save": "Save",
        "comet.core.table.localChangesToolbar.unsavedItems":
            "{count, plural, =0 {no unsaved changes} one {# unsaved change} other {# unsaved changes}}",
        "comet.core.table.tableFilterFinalForm.resetButton": "Reset Filter",
        "comet.core.table.tableQuery.error": "Error :( {error}",
    },
    de: {
        "comet.core.table.localChangesToolbar.unsavedItems":
            "{count, plural, =0 {keine ungespeicherten Änderungen} one {# ungespeicherte Änderung} other {# ungespeicherte Änderungen}}",
        "comet.core.table.tableQuery.error": "Fehler :( {error}",
    },
};

function isLocaleKey(value: any): value is LocaleKey {
    return value === "de" || value === "en";
}

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
};

const preview: Preview = {
    tags: ["autodocs"],
    argTypes: {
        locale: { name: "Locale", control: "select", options: ["en", "de"], mapping: { en: "English" } },
    },
    args: { locale: "en" },
    decorators: [
        ThemeProviderDecorator,
        (Story, context) => {
            const { locale: selectedLocale } = context.args;

            return (
                <IntlProvider locale={selectedLocale} messages={isLocaleKey(selectedLocale) ? messages[selectedLocale] : {}}>
                    <DateFnsLocaleProvider value={isLocaleKey(selectedLocale) ? dateFnsLocales[selectedLocale] : dateFnsLocales.en}>
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
                    </DateFnsLocaleProvider>
                </IntlProvider>
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

        docs: {
            codePanel: true,
        },
    },
};

export default preview;

worker.start();
