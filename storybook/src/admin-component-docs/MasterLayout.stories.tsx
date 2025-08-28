import { MasterLayout } from "@comet/admin";
import type { Meta, StoryObj } from "@storybook/react-webpack5";

import { componentDocsDecorator } from "./utils/componentDocsDecorator";
import { DocsPage } from "./utils/DocsPage";

type Story = StoryObj<typeof MasterLayout>;

const meta: Meta<typeof MasterLayout> = {
    component: MasterLayout,
    title: "Component Docs/MasterLayout",
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
