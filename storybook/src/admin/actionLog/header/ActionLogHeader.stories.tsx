import { ActionLogHeader } from "@comet/admin";
import { Typography } from "@mui/material";
import type { Meta, StoryObj } from "@storybook/react-webpack5";
import { FormattedMessage } from "react-intl";
import { v4 as uuid } from "uuid";

type Story = StoryObj<typeof ActionLogHeader>;
const meta: Meta<typeof ActionLogHeader> = {
    component: ActionLogHeader,
    title: "@comet/admin/Action log/Components/Header/Action log header",
};
export default meta;

export const StandardActionLogHeader: Story = {
    args: {
        id: uuid(),
        title: "Title",
    },
};

export const WithActions: Story = {
    args: {
        id: uuid(),
        title: "Title",
        action: (
            <Typography variant="caption">
                <FormattedMessage
                    defaultMessage="You can only compare 2 versions at a time."
                    id="actionLog.actionLogGrid.info.onlyCompare2Versions"
                />
            </Typography>
        ),
    },
};
