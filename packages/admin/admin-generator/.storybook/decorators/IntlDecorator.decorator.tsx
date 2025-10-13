import { type Decorator } from "@storybook/react-webpack5";
import { createIntl, createIntlCache, IntlProvider, MessageDescriptor, RawIntlProvider } from "react-intl";
import { de, enUS } from "date-fns/locale";
import { DateFnsLocaleProvider } from "@comet/admin-date-time";


export enum LocaleOptions {
    German = "de",
    English = "en",
    Ids = "ids",
}
type DateFnsLocale = typeof de;
const dateFnsLocales: Record<LocaleOptions,DateFnsLocale> = {
    [LocaleOptions.German]: de,
    [LocaleOptions.English]: enUS,
    [LocaleOptions.Ids]: enUS,
};

// @TODO: use messages from lang-package
const messages = {
    en: {
        "comet.searchInput.placeholder": "Search",
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
        "comet.searchInput.placeholder": "Suche",
        "comet.core.table.localChangesToolbar.unsavedItems":
            "{count, plural, =0 {keine ungespeicherten Änderungen} one {# ungespeicherte Änderung} other {# ungespeicherte Änderungen}}",
        "comet.core.table.tableQuery.error": "Fehler :( {error}",
    },
};

export const IntlDecorator: Decorator = (fn, context) => {
    const { locale : selectedLocale } = context.globals;

    // Intl Provider which renders id's instead of translated messages
    if (selectedLocale === LocaleOptions.Ids)
    {
        const cache = createIntlCache();
        const intl = createIntl({ locale: selectedLocale }, cache);
        intl.formatMessage = ((messageDescriptor: MessageDescriptor) => {
            return messageDescriptor.id ?? "";
        }) as typeof intl.formatMessage;

        return (
            <RawIntlProvider value={intl}>
                <DateFnsLocaleProvider value={dateFnsLocales[selectedLocale]}>
                    {fn()}
                </DateFnsLocaleProvider>
            </RawIntlProvider>
        );
    }

    return (
        <IntlProvider
            locale={selectedLocale}
            messages={messages[selectedLocale]}
            onError={() => {
                // disable error logging
            }}
        >
            <DateFnsLocaleProvider value={dateFnsLocales[selectedLocale]}>
                {fn()}
            </DateFnsLocaleProvider>
        </IntlProvider>
    );
};
