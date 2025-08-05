import { Button, InlineAlert } from "@comet/admin";
import { Clear, CometColor, InfoFilled, Reload, RemoveFilled, WarningSolid } from "@comet/admin-icons";
import { Box } from "@mui/material";
import type { Meta, StoryObj } from "@storybook/react-webpack5";

type Story = StoryObj<typeof InlineAlert>;

const config: Meta<typeof InlineAlert> = {
    component: InlineAlert,
    title: "@comet/admin/inlineAlert/Inline Alert",
    argTypes: {
        severity: {
            control: "select",
            options: [undefined, "error", "warning", "info"],
        },
    },
};

export default config;

/**
 * Renders the `InlineAlert` component with default settings.
 * Demonstrates the base appearance of the error component.
 */
export const InlineAlertStory: Story = {};
InlineAlertStory.name = "InlineAlert";

/**
 * Displays the `InlineAlert` component with a warning variant.
 * This variation visually represents a warning message to the user.
 */
export const InlineAlertWithWarning: Story = {
    args: {
        severity: "warning",
    },
};

/**
 * Displays the `InlineAlert` component with an info variant.
 * This variant is used for informational messages rather than errors.
 */
export const InlineAlertWithInfo: Story = {
    args: {
        severity: "info",
    },
};

/**
 * Displays the `InlineAlert` component with custom content.
 * Includes a custom icon, title, and description to illustrate how
 * the component can be adjusted for different use cases.
 */
export const InlineAlertWithCustomContent: Story = {
    args: {
        icon: <CometColor sx={{ fontSize: "32px" }} />,
        title: "Custom Title",
        description: "Custom Description",
    },
};

/**
 * Displays the `InlineAlert` component with custom icons by using `iconMapping` prop.
 */
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

/**
 * Displays the `InlineAlert` component with an action button.
 * The button allows the user to retry an action when an error occurs.
 * Clicking the button triggers an alert as an example interaction.
 */
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

/**
 * Displays the `InlineAlert` component with multiple actions.
 * Includes a retry button and a clear button to demonstrate
 * how multiple interactions can be provided to the user.
 */
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
