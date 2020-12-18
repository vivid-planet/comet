import { select, withKnobs } from "@storybook/addon-knobs";
import { addDecorator, configure } from "@storybook/react";
import "@vivid-planet/comet-admin-color-picker/src/themeAugmentation";
import * as React from "react";
import { IntlProvider } from "react-intl";
import { createMuiTheme, MuiThemeProvider as ThemeProvider } from "@vivid-planet/comet-admin";

const req = require.context("../src", true, /\.tsx$/);

function loadStories() {
    req.keys().forEach(req);
}

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

addDecorator((story) => {
    const theme = createMuiTheme({});

    return <ThemeProvider theme={theme}>{story()}</ThemeProvider>;
});

configure(loadStories, module);
