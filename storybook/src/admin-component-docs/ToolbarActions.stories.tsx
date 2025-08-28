import { ToolbarActions } from "@comet/admin";
import type { Meta, StoryObj } from "@storybook/react-webpack5";

import { componentDocsDecorator } from "./utils/componentDocsDecorator";
import { DocsPage } from "./utils/DocsPage";

type Story = StoryObj<typeof ToolbarActions>;

const meta: Meta<typeof ToolbarActions> = {
    component: ToolbarActions,
    title: "Component Docs/ToolbarActions",
    tags: ["adminComponentDocs"],
    decorators: [componentDocsDecorator()],
    parameters: {
        docs: {
            page: () => <DocsPage defaultStory={Default} />,
        },
    },
};

export default meta;

/**
 * ⚠️ This components documentation is incomplete and will be updated in the future.
 */
export const Default: Story = {};
