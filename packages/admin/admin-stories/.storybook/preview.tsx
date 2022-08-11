import "@fontsource/roboto/100.css";
import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";

import { MainContent, MuiThemeProvider } from "@comet/admin";
import { DateFnsLocaleProvider } from "@comet/admin-date-time";
import { createCometTheme } from "@comet/admin-theme";
import { createTheme as createMuiTheme, GlobalStyles } from "@mui/material";
import { select, withKnobs } from "@storybook/addon-knobs";
import { addDecorator, addParameters } from "@storybook/react";
import * as React from "react";
import { IntlProvider } from "react-intl";
import { de as deLocale, enUS as enLocale } from "date-fns/locale";
import { Locale as DateFnsLocale } from "date-fns";

import { previewGlobalStyles } from "./preview.styles";

type LocaleKey = "de" | "en";

const dateFnsLocales: Record<LocaleKey, DateFnsLocale> = {
    de: deLocale,
    en: enLocale,
};

addDecorator((story, context) => {
    const storyWithKnobs = withKnobs(story, context); // explicitly add withKnobs
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

    const selectedLocale = select<LocaleKey>("Locale", ["en", "de"], "en");

    return (
        <IntlProvider locale={selectedLocale} messages={messages[selectedLocale] ?? {}}>
            <DateFnsLocaleProvider value={dateFnsLocales[selectedLocale]}>{storyWithKnobs}</DateFnsLocaleProvider>
        </IntlProvider>
    );
});

const themeOptions = {
    comet: "Comet",
    defaultMui: "Default MUI",
};

addDecorator((story, ctx) => {
    const selectedTheme = select("Theme", Object.values(themeOptions), Object.values(themeOptions)[0]);
    const theme = selectedTheme === themeOptions.defaultMui ? createMuiTheme() : createCometTheme();

    return (
        <MuiThemeProvider theme={theme}>
            <GlobalStyles styles={previewGlobalStyles} />
            <>{ctx.parameters.layout === "padded" ? <MainContent>{story()}</MainContent> : story()}</>
        </MuiThemeProvider>
    );
});

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
    "docs-form-components-finalform",
    "docs-form-components-fieldcontainer",
    "docs-form-components-field",
    "docs-form-components-formsection",
    "docs-form-components-finalform-fields",
    "docs-form-components",
];
const orderHooks = ["docs-hooks-hooks", "docs-hooks"];
const orderIcons = ["docs-icons-all-icons", "docs-icons-usage", "docs-icons"];
const orderBestPractices = ["docs-best-practices-overview", "docs-best-theme-and-styling", "docs-best-practices"];
const orderDevelopment = ["docs-development-overview", "docs-development-create-a-component-with-theme-support", "docs-development"];

const order = [
    "docs-intro-",
    ...orderGettingStarted,
    ...orderComponents,
    ...orderForm,
    ...orderHooks,
    ...orderIcons,
    ...orderBestPractices,
    ...orderDevelopment,
    "admin-",
    "comet-",
    "stories-",
];

addParameters({
    layout: "padded",
    options: {
        storySort: (a, b) => {
            const aName = a[0];
            const bName = b[0];

            const aIdx = order.findIndex((i) => aName.indexOf(i) > -1);
            const bIdx = order.findIndex((i) => bName.indexOf(i) > -1);
            return aIdx - bIdx;

            return aName < bName ? -1 : 1;
        },
    },
});
