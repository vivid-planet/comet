import { type Decorator } from "@storybook/react-webpack5";
import { de, enUS } from "date-fns/locale";
import { IntlProvider } from "react-intl";

enum LocaleOption {
    German = "de",
    English = "en",
}

function isLocaleOption(value: any): value is LocaleOption {
    return value === "de" || value === "en";
}

type DateFnsLocale = typeof de;
const dateFnsLocales: Record<LocaleOption, DateFnsLocale> = {
    [LocaleOption.German]: de,
    [LocaleOption.English]: enUS,
};

// @TODO: use messages from lang-package
const messages: Record<LocaleOption, Record<string, string>> = {
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

export const IntlDecorator: Decorator = (fn, context) => {
    const { locale: selectedLocale = LocaleOption.English } = context.globals;
    const selecteDateFnsLocale = isLocaleOption(selectedLocale) ? dateFnsLocales[selectedLocale] : dateFnsLocales.en;

    return (
        <IntlProvider
            locale={selectedLocale}
            messages={isLocaleOption(selectedLocale) ? messages[selectedLocale] : {}}
            onError={() => {
                // disable error logging
            }}
        >
            {fn()}
        </IntlProvider>
    );
};
