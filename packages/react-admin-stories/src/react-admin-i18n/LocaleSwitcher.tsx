import { storiesOf } from "@storybook/react";
import * as React from "react";
import { I18nProvider, LocaleSwitcher } from "@vivid-planet/react-admin-i18n";
import { FormattedMessage } from "react-intl";

function Story() {
    return (
        <I18nProvider defaultLocale="de" supportedLocales={["de", "en"]}>
            <LocaleSwitcher />
            <FormattedMessage id="app.learn-react-link" defaultMessage="123" description="Link on react page" />
        </I18nProvider>
    );
}

storiesOf("react-admin-i18n", module).add("Locale Switcher", () => <Story />);
