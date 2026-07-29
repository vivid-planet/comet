import { DateFnsLocaleProvider } from "@dextinity/admin-date-time";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import type { Decorator } from "@storybook/react-vite";
import { de, enUS } from "date-fns/locale";
import { IntlProvider } from "react-intl";

export enum LocaleOption {
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
        "dextinity.core.deleteMutation.promptDelete": "Delete data?",
        "dextinity.core.deleteMutation.yes": "Yes",
        "dextinity.core.deleteMutation.no": "No",
        "dextinity.core.dirtyHandler.discardChanges": "Discard unsaved changes?",
        "dextinity.core.editDialog.edit": "Edit",
        "dextinity.core.editDialog.add": "Add",
        "dextinity.core.editDialog.cancel": "Cancel",
        "dextinity.core.editDialog.save": "Save",
        "dextinity.core.finalForm.abort": "Cancel",
        "dextinity.core.finalForm.save": "Save",
        "dextinity.core.router.confirmationDialog.confirm": "OK",
        "dextinity.core.router.confirmationDialog.abort": "Cancel",
        "dextinity.core.stack.stack.back": "Back",
        "dextinity.core.table.addButton": "Add",
        "dextinity.core.table.excelExportButton": "Export",
        "dextinity.core.table.deleteButton": "Delete",
        "dextinity.core.table.pagination.pageInfo": "Page {current} of {total}",
        "dextinity.core.table.localChangesToolbar.save": "Save",
        "dextinity.core.table.localChangesToolbar.unsavedItems":
            "{count, plural, =0 {no unsaved changes} one {# unsaved change} other {# unsaved changes}}",
        "dextinity.core.table.tableFilterFinalForm.resetButton": "Reset Filter",
        "dextinity.core.table.tableQuery.error": "Error :( {error}",
    },
    de: {
        "dextinity.core.table.localChangesToolbar.unsavedItems":
            "{count, plural, =0 {keine ungespeicherten Änderungen} one {# ungespeicherte Änderung} other {# ungespeicherte Änderungen}}",
        "dextinity.core.table.tableQuery.error": "Fehler :( {error}",
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
            <LocalizationProvider adapterLocale={selecteDateFnsLocale} dateAdapter={AdapterDateFns}>
                <DateFnsLocaleProvider value={selecteDateFnsLocale}>{fn()}</DateFnsLocaleProvider>
            </LocalizationProvider>
        </IntlProvider>
    );
};
