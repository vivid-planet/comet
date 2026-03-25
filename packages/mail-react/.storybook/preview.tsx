import type { Preview } from "@storybook/react-vite";

import { MailRendererDecorator } from "../src/storybook-preview/index.ts";

const preview: Preview = {
    decorators: [MailRendererDecorator],
};

export default preview;
