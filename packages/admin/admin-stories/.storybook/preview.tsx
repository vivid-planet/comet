import "@fontsource/roboto/100.css";
import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";

import { MainContent, MuiThemeProvider } from "@comet/admin";
import { createCometTheme } from "@comet/admin-theme";
import { createTheme, Theme } from "@material-ui/core";
import { select, withKnobs } from "@storybook/addon-knobs";
import { addDecorator, addParameters } from "@storybook/react";
import * as React from "react";
import { IntlProvider } from "react-intl";
import { createGlobalStyle } from "styled-components";

import { previewGlobalStyles } from "./preview.styles";

addDecorator((story, context) => {
    const storyWithKnobs = withKnobs(story, context); // explicitly add withKnobs
    // @TODO: use messages from lang-package
    const messages = {
        en: {
            "cometAdmin.core.deleteMutation.promptDelete": "Delete data?",
            "cometAdmin.core.deleteMutation.yes": "Yes",
            "cometAdmin.core.deleteMutation.no": "No",
            "cometAdmin.core.dirtyHandler.discardChanges": "Discard unsaved changes?",
            "cometAdmin.core.editDialog.edit": "Edit",
            "cometAdmin.core.editDialog.add": "Add",
            "cometAdmin.core.editDialog.cancel": "Cancel",
            "cometAdmin.core.editDialog.save": "Save",
            "cometAdmin.core.finalForm.abort": "Cancel",
            "cometAdmin.core.finalForm.save": "Save",
            "cometAdmin.core.router.confirmationDialog.confirm": "OK",
            "cometAdmin.core.router.confirmationDialog.abort": "Cancel",
            "cometAdmin.core.stack.stack.back": "Back",
            "cometAdmin.core.table.addButton": "Add",
            "cometAdmin.core.table.excelExportButton": "Export",
            "cometAdmin.core.table.deleteButton": "Delete",
            "cometAdmin.core.table.pagination.pageInfo": "Page {current} of {total}",
            "cometAdmin.core.table.localChangesToolbar.save": "Save",
            "cometAdmin.core.table.localChangesToolbar.unsavedItems":
                "{count, plural, =0 {no unsaved changes} one {# unsaved change} other {# unsaved changes}}",
            "cometAdmin.core.table.tableFilterFinalForm.resetButton": "Reset Filter",
            "cometAdmin.core.table.tableQuery.error": "Error :( {error}",
        },
        de: {
            "cometAdmin.core.table.localChangesToolbar.unsavedItems":
                "{count, plural, =0 {keine ungespeicherten Änderungen} one {# ungespeicherte Änderung} other {# ungespeicherte Änderungen}}",
            "cometAdmin.core.table.tableQuery.error": "Fehler :( {error}",
        },
    };
    const selectedLocale = select("Locale", ["en", "de"], "en");
    return (
        <IntlProvider locale={selectedLocale} messages={messages[selectedLocale] ?? {}}>
            {storyWithKnobs}
        </IntlProvider>
    );
});

const themeOptions = {
    comet: "Comet",
    defaultMui: "Default MUI",
};

const GlobalStyles = createGlobalStyle`
    ${previewGlobalStyles}
`;

addDecorator((story, ctx) => {
    const selectedTheme = select("Theme", Object.values(themeOptions), Object.values(themeOptions)[0]);
    const theme = selectedTheme === themeOptions.defaultMui ? createTheme() : createCometTheme();

    return (
        <MuiThemeProvider theme={theme}>
            <GlobalStyles />
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
    "docs-components",
];
const orderForm = [
    "docs-form-overview",
    "docs-form-validation",
    "docs-form-layout",
    "docs-form-components-fieldcontainer",
    "docs-form-components-field",
    "docs-form-components-formsection",
    "docs-form-components",
];
const orderHooks = ["docs-hooks-hooks", "docs-hooks"];
const orderIcons = ["docs-icons-list", "docs-icons-usage", "docs-icons"];
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

declare module "styled-components" {
    export interface DefaultTheme extends Theme {}
}
