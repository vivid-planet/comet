import { select, withKnobs } from "@storybook/addon-knobs";
import { addDecorator, configure } from "@storybook/react";
import "@comet/admin-color-picker/src/themeAugmentation";
import * as React from "react";
import { IntlProvider } from "react-intl";
import { createMuiTheme, MuiThemeProvider as ThemeProvider } from "@comet/admin-core";

const req = require.context("../src", true, /\.tsx$/);

function loadStories() {
    req.keys().forEach(req);
}

addDecorator((story, context) => {
    const storyWithKnobs = withKnobs(story, context); // explicitly add withKnobs
    // @TODO: use messages from lang-package
    const messages = {
        en: {
            "cometAdminCore.core.deleteMutation.promptDelete": "Delete data?",
            "cometAdminCore.core.deleteMutation.yes": "Yes",
            "cometAdminCore.core.deleteMutation.no": "No",
            "cometAdminCore.core.dirtyHandler.discardChanges": "Discard unsaved changes?",
            "cometAdminCore.core.editDialog.edit": "Edit",
            "cometAdminCore.core.editDialog.add": "Add",
            "cometAdminCore.core.editDialog.cancel": "Cancel",
            "cometAdminCore.core.editDialog.save": "Save",
            "cometAdminCore.core.finalForm.abort": "Cancel",
            "cometAdminCore.core.finalForm.save": "Save",
            "cometAdminCore.core.router.confirmationDialog.confirm": "OK",
            "cometAdminCore.core.router.confirmationDialog.abort": "Cancel",
            "cometAdminCore.core.stack.stack.back": "Back",
            "cometAdminCore.core.table.addButton": "Add",
            "cometAdminCore.core.table.excelExportButton": "Export",
            "cometAdminCore.core.table.deleteButton": "Delete",
            "cometAdminCore.core.table.pagination.pageInfo": "Page {current} of {total}",
            "cometAdminCore.core.table.localChangesToolbar.save": "Save",
            "cometAdminCore.core.table.localChangesToolbar.unsavedItems":
                "{count, plural, =0 {no unsaved changes} one {# unsaved change} other {# unsaved changes}}",
            "cometAdminCore.core.table.tableFilterFinalForm.resetButton": "Reset Filter",
            "cometAdminCore.core.table.tableQuery.error": "Error :( {error}",
        },
        de: {
            "cometAdminCore.core.table.localChangesToolbar.unsavedItems":
                "{count, plural, =0 {keine ungespeicherten Änderungen} one {# ungespeicherte Änderung} other {# ungespeicherte Änderungen}}",
            "cometAdminCore.core.table.tableQuery.error": "Fehler :( {error}",
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
