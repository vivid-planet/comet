import { Button, InlineAlert } from "@comet/admin";
import { ArrowRight, Clear, CometColor, InfoFilled, Reload, RemoveFilled, WarningSolid } from "@comet/admin-icons";
import { Box } from "@mui/material";
import type { Meta, StoryObj } from "@storybook/react-webpack5";

import { componentDocsDecorator } from "./utils/componentDocsDecorator";
import { DocsPage } from "./utils/DocsPage";

type Story = StoryObj<typeof InlineAlert>;

const meta: Meta<typeof InlineAlert> = {
    component: InlineAlert,
    title: "Component Docs/InlineAlert",
    decorators: [componentDocsDecorator()],
    parameters: {
        docs: {
            page: () => <DocsPage defaultStory={DefaultStory} />,
        },
    },
    argTypes: {
        description: {
            control: "text",
        },
        descriptionMapping: {
            control: "object",
        },
        icon: {
            control: "select",
            options: [undefined, "ArrowRight"],
        },
        iconMapping: {
            control: "object",
        },
        severity: {
            control: "select",
            options: [undefined, "error", "warning", "info"],
        },
        actions: {
            control: "select",
            options: [undefined, "Retry Button"],
        },
        title: {
            control: "text",
        },
        titleMapping: {
            control: "object",
        },
    },
};

export default meta;

/**
 * Used to display important information to the user inside of an element, e.g., a loading error in a `DataGrid`.
 */
export const DefaultStory: Story = {
    render: ({ icon, actions, ...props }) => {
        return (
            <InlineAlert
                {...props}
                icon={icon === "ArrowRight" ? <ArrowRight /> : icon}
                actions={actions === "Retry Button" ? <Button startIcon={<Reload />}>Retry</Button> : actions}
            />
        );
    },
};

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
