import { Clear, CometColor, InfoFilled, Reload, RemoveFilled, WarningSolid } from "@comet/admin-icons";
import { Box } from "@mui/material";
import type { Meta, StoryObj } from "@storybook/react-vite";

import { Button } from "../../common/buttons/Button";
import { InlineAlert } from "../InlineAlert";

type Story = StoryObj<typeof InlineAlert>;

const config: Meta<typeof InlineAlert> = {
    component: InlineAlert,
    title: "components/inlineAlert/InlineAlert",
    argTypes: {
        severity: {
            control: "select",
            options: [undefined, "error", "warning", "info"],
        },
    },
};

export default config;

export const InlineAlertStory: Story = {};
InlineAlertStory.storyName = "InlineAlert";

export const InlineAlertWithWarning: Story = {
    args: {
        severity: "warning",
    },
};

export const InlineAlertWithInfo: Story = {
    args: {
        severity: "info",
    },
};

export const InlineAlertWithCustomContent: Story = {
    args: {
        icon: <CometColor sx={{ fontSize: "32px" }} />,
        title: "Custom Title",
        description: "Custom Description",
    },
};

export const InlineAlertWithIconMapper: Story = {
    args: {
        severity: "warning",
        iconMapping: {
            error: <RemoveFilled sx={{ fontSize: "32px" }} color="error" />,
            info: <InfoFilled sx={{ fontSize: "32px" }} color="info" />,
            warning: <WarningSolid sx={{ fontSize: "32px" }} color="warning" />,
        },
    },
};

export const InlineAlertWithActions: Story = {
    args: {
        actions: (
            <Button
                startIcon={<Reload />}
                variant="primary"
                onClick={() => {
                    alert("onRetry clicked");
                }}
            >
                Try to reload
            </Button>
        ),
    },
};

export const InlineAlertWithMultipleActions: Story = {
    args: {
        actions: (
            <Box sx={{ display: "flex", gap: 2 }}>
                <Button
                    startIcon={<Reload />}
                    variant="primary"
                    onClick={() => {
                        alert("onRetry clicked");
                    }}
                >
                    Try to reload
                </Button>
                <Button
                    startIcon={<Clear />}
                    variant="outlined"
                    onClick={() => {
                        alert("on Clear clicked");
                    }}
                >
                    Clear all filters
                </Button>
            </Box>
        ),
    },
};
