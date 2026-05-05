import type { Preview } from "@storybook/react-webpack5";

import { IntlProviderDecorator } from "./decorators/IntlProvider.decorator";

const preview: Preview = {
    decorators: [IntlProviderDecorator],
    tags: ["autodocs"],
};

export default preview;
