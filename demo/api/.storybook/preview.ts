import type { Preview } from "@storybook/react-webpack5";

import { IntlDecorator } from "./decorators/IntlProvider.decorator";
import { LocaleOption } from "./decorators/IntlProvider.decorator";
import { type GlobalTypes } from "storybook/internal/csf";

const preview: Preview = {
    tags: ["autodocs"],
    decorators: [IntlDecorator],

    parameters: {
        docs: {
            codePanel: true,
        },
        controls: {
            matchers: {
                color: /(background|color)$/i,
                date: /Date$/i,
            },
        },
    },
};

export const globalTypes: GlobalTypes = {
    locale: {
        name: "Locale",
        description: "Locale",
        defaultValue: LocaleOption.EN,
        toolbar: {
            title: "Locale",
            icon: "globe",
            items: [
                { value: LocaleOption.EN, title: "English" },
                { value: LocaleOption.DE, title: "German" },
            ],
            showName: true,
            dynamicTitle: true,
        },
    },
};

export default preview;
