import type { Preview } from "@storybook/react-webpack5";

import { IntlDecorator } from "./decorators/IntlProvider.decorator";

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

export default preview;
