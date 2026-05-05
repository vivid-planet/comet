import type { Decorator } from "@storybook/react-webpack5";
import { IntlProvider } from "react-intl";

export const IntlProviderDecorator: Decorator = (Story) => (
    <IntlProvider locale="en">
        <Story />
    </IntlProvider>
);
