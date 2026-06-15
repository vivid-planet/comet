import type { Meta, StoryObj } from "@storybook/react-vite";

import { ContentScopeProvider } from "../../../../contentScope/Provider";
import { GlobalActionLogGrid } from "../GlobalActionLogGrid";

type Story = StoryObj<typeof GlobalActionLogGrid>;

const meta: Meta<typeof GlobalActionLogGrid> = {
    component: GlobalActionLogGrid,
    tags: ["!autodocs"],
    title: "actionLog/globalActionLog/globalActionLogGrid/GlobalActionLogGrid",
    decorators: [
        (Story) => (
            <ContentScopeProvider
                values={[
                    { scope: { domain: "main", language: "en" }, label: { domain: "Main", language: "English" } },
                    { scope: { domain: "main", language: "de" }, label: { domain: "Main", language: "German" } },
                ]}
                defaultValue={{ domain: "main", language: "en" }}
            >
                {() => <Story />}
            </ContentScopeProvider>
        ),
    ],
};
export default meta;

export const Default: Story = {};
