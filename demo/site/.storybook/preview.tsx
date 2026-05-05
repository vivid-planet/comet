import type { Preview } from "@storybook/react-vite";
import { IntlProvider } from "react-intl";
import type { DecoratorFunction } from "storybook/internal/csf";
import type { ReactRenderer } from "storybook/internal/types";

const IntlDecorator: DecoratorFunction<ReactRenderer> = (Story) => (
    <IntlProvider locale="en" messages={{}}>
        <Story />
    </IntlProvider>
);

const preview: Preview = {
    decorators: [IntlDecorator],
    parameters: {
        controls: {
            matchers: {
                color: /(background|color)$/i,
                date: /Date$/i,
            },
        },
    },
};

export default preview;
