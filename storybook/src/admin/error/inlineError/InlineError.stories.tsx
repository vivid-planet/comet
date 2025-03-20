import { InlineError } from "@comet/admin";
import { Clear, CometColor, InfoFilled, Reload, RemoveFilled, WarningSolid } from "@comet/admin-icons";
import { Box, Button } from "@mui/material";
import type { Meta, StoryObj } from "@storybook/react";

type Story = StoryObj<typeof InlineError>;

const config: Meta<typeof InlineError> = {
    component: InlineError,
    title: "@comet/admin/error/Inline Error",
};

export default config;

/**
 * Renders the `InlineError` component with default settings.
 * Demonstrates the base appearance of the error component.
 */
export const InlineErrorStory: Story = {};
InlineErrorStory.storyName = "InlineError";

/**
 * Displays the `InlineError` component with a warning variant.
 * This variation visually represents a warning message to the user.
 */
export const InlineErrorWithWarning: Story = {
    args: {
        variant: "warning",
    },
};

/**
 * Displays the `InlineError` component with an info variant.
 * This variant is used for informational messages rather than errors.
 */
export const InlineErrorWithInfo: Story = {
    args: {
        variant: "info",
    },
};

/**
 * Displays the `InlineError` component with custom content.
 * Includes a custom icon, title, and description to illustrate how
 * the component can be adjusted for different use cases.
 */
export const InlineErrorWithCustomContent: Story = {
    args: {
        icon: <CometColor sx={{ fontSize: "32px" }} />,
        title: "Custom Title",
        description: "Custom Description",
    },
};

/**
 * Displays the `InlineError` component with custom icons by using `iconMapping` prop.
 */
export const InlineErrorWithIconMapper: Story = {
    args: {
        variant: "warning",
        iconMapping: {
            error: <RemoveFilled sx={{ fontSize: "32px" }} color="error" />,
            info: <InfoFilled sx={{ fontSize: "32px" }} color="info" />,
            warning: <WarningSolid sx={{ fontSize: "32px" }} color="warning" />,
        },
    },
};

/**
 * Displays the `InlineError` component with an action button.
 * The button allows the user to retry an action when an error occurs.
 * Clicking the button triggers an alert as an example interaction.
 */
export const InlineErrorWithActions: Story = {
    args: {
        actions: (
            <Button
                startIcon={<Reload />}
                variant="contained"
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
 * Displays the `InlineError` component with multiple actions.
 * Includes a retry button and a clear button to demonstrate
 * how multiple interactions can be provided to the user.
 */
export const InlineErrorWithMultipleActions: Story = {
    args: {
        actions: (
            <Box sx={{ display: "flex", gap: 2 }}>
                <Button
                    startIcon={<Reload />}
                    variant="contained"
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
