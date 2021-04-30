import "@fontsource/roboto/100.css";
import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";

import { select, withKnobs } from "@storybook/addon-knobs";
import { addDecorator, addParameters } from "@storybook/react";
import * as React from "react";
import { IntlProvider } from "react-intl";
import { MuiThemeProvider } from "@comet/admin";
import { Theme, createMuiTheme } from "@material-ui/core";
import { getThemeOptions } from "@comet/admin-theme";
import styled, { createGlobalStyle } from "styled-components";

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
    return (
        <IntlProvider locale={select("Locale", ["de", "en"], "de")} messages={messages[select("Locale", ["de", "en"], "de")] ?? {}}>
            {storyWithKnobs}
        </IntlProvider>
    );
});

const themeOptions = {
    comet: "Comet",
    defaultMui: "Default MUI",
};

const GlobalStyles = createGlobalStyle`
    body {
        margin: 0;
      
        &.sb-show-main.sb-main-padded {
            padding: 0;
        }
    }
`;

const StoryWrapper = styled.div`
    min-height: 100vh;
`;

addDecorator((story) => {
    const selectedTheme = select("Theme", Object.values(themeOptions), Object.values(themeOptions)[0]);
    const theme = createMuiTheme(selectedTheme === themeOptions.defaultMui ? {} : getThemeOptions());

    return (
        <>
            <GlobalStyles />
            <MuiThemeProvider theme={theme}>
                <StoryWrapper>{story()}</StoryWrapper>
            </MuiThemeProvider>
        </>
    );
});

const order = ["intro-", "admin-", "comet-"];

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
