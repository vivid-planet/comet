import { select, withKnobs } from "@storybook/addon-knobs";
import { addDecorator, configure } from "@storybook/react";
import { createMuiTheme, MuiThemeProvider as ThemeProvider } from "@vivid-planet/react-admin-mui";
import * as React from "react";
import { IntlProvider } from "react-intl";

const req = require.context("../src", true, /\.tsx$/);

function loadStories() {
    req.keys().forEach(req);
}

addDecorator((story, context) => {
    const storyWithKnobs = withKnobs(story, context); // explicitly add withKnobs
    // @TODO: use messages from lang-package
    const messages = {
        en: {
            "reactAdmin.core.deleteMutation.promptDelete": "Delete data?",
            "reactAdmin.core.deleteMutation.yes": "Yes",
            "reactAdmin.core.deleteMutation.no": "No",
            "reactAdmin.core.dirtyHandler.discardChanges": "Discard unsaved changes?",
            "reactAdmin.core.editDialog.edit": "Edit",
            "reactAdmin.core.editDialog.add": "Add",
            "reactAdmin.core.editDialog.cancel": "Cancel",
            "reactAdmin.core.editDialog.save": "Save",
            "reactAdmin.core.finalForm.abort": "Cancel",
            "reactAdmin.core.finalForm.save": "Save",
            "reactAdmin.core.router.confirmationDialog.confirm": "OK",
            "reactAdmin.core.router.confirmationDialog.abort": "Cancel",
            "reactAdmin.core.stack.stack.back": "Back",
            "reactAdmin.core.table.addButton": "Add",
            "reactAdmin.core.table.excelExportButton": "Export",
            "reactAdmin.core.table.deleteButton": "Delete",
            "reactAdmin.core.table.pagination.pageInfo": "Page {current} of {total}",
            "reactAdmin.core.table.localChangesToolbar.save": "Save",
            "reactAdmin.core.table.localChangesToolbar.unsavedItems":
                "{count, plural, =0 {no unsaved changes} one {# unsaved change} other {# unsaved changes}}",
            "reactAdmin.core.table.tableFilterFinalForm.resetButton": "Reset Filter",
            "reactAdmin.core.table.tableQuery.error": "Error :( {error}",
        },
        de: {
            "reactAdmin.core.table.localChangesToolbar.unsavedItems":
                "{count, plural, =0 {keine ungespeicherten Änderungen} one {# ungespeicherte Änderung} other {# ungespeicherte Änderungen}}",
            "reactAdmin.core.table.tableQuery.error": "Fehler :( {error}",
        },
    };
    return (
        <IntlProvider locale={select("Locale", ["de", "en"], "de")} messages={messages[select("Locale", ["de", "en"], "de")] ?? {}}>
            {storyWithKnobs}
        </IntlProvider>
    );
});

addDecorator(story => {
    const theme = createMuiTheme({});

    return <ThemeProvider theme={theme}>{story()}</ThemeProvider>;
});

configure(loadStories, module);
