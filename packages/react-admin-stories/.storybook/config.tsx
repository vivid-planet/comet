import { addDecorator, configure } from "@storybook/react";
import { createMuiTheme, MuiThemeProvider as ThemeProvider } from "@vivid-planet/react-admin-mui";
import { withKnobs, select } from "@storybook/addon-knobs";
import { IntlProvider } from "react-intl";

import * as React from "react";

const req = require.context("../src", true, /\.tsx$/);

function loadStories() {
    req.keys().forEach(req);
}

addDecorator((story, context) => {
    const storyWithKnobs = withKnobs(story, context); // explicitly add withKnobs
    const messages = {
        de: {
            "reactAdmin.core.finalForm.save": "Speichern",
        },
        en: {
            "reactAdmin.core.finalForm.save": "Save",
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
