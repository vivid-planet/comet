import type { Preview } from "@storybook/react-vite";

import { MailRendererDecorator } from "./MailRenderer.decorator.tsx";

const preview: Preview = {
    decorators: [MailRendererDecorator],
};

export default preview;
