import type { Meta, StoryObj } from "@storybook/react-vite";

import { ContentScopeProvider } from "../../../../contentScope/Provider";
import { ActionLogsGrid } from "../ActionLogsGrid";

type Story = StoryObj<typeof ActionLogsGrid>;

const meta: Meta<typeof ActionLogsGrid> = {
    component: ActionLogsGrid,
    tags: ["!autodocs"],
    title: "Action log/Action logs/Grid",
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
