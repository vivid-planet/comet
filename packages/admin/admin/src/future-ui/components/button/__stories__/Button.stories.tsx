import { ArrowRight, Favorite } from "@comet/admin-icons";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";

import { Typography } from "../../typography/Typography";
import { Button } from "../Button";

const meta: Meta<typeof Button> = {
    component: Button,
    title: "Future UI/Button",
    argTypes: {
        variant: {
            control: "radio",
            options: ["primary", "secondary"],
        },
        disabled: {
            control: "boolean",
        },
    },
};

export default meta;

type Story = StoryObj<typeof Button>;

export const Primary: Story = {
    args: {
        children: "Button",
        variant: "primary",
    },
};

export const Secondary: Story = {
    args: {
        children: "Button",
        variant: "secondary",
    },
};

/**
 * All button variants displayed side by side in their enabled, disabled,
 * and icon-enhanced states — a quick visual reference for choosing the
 * right variant and configuration.
 */
export const VariantGallery: Story = {
    render: () => (
        <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
            <div>
                <Typography variant="headline" element="h3" style={{ marginBottom: "0.75rem" }}>
                    Enabled
                </Typography>
                <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
                    <Button variant="primary">Primary</Button>
                    <Button variant="secondary">Secondary</Button>
                </div>
            </div>
            <div>
                <Typography variant="headline" element="h3" style={{ marginBottom: "0.75rem" }}>
                    Disabled
                </Typography>
                <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
                    <Button variant="primary" disabled>
                        Primary
                    </Button>
                    <Button variant="secondary" disabled>
                        Secondary
                    </Button>
                </div>
            </div>
            <div>
                <Typography variant="headline" element="h3" style={{ marginBottom: "0.75rem" }}>
                    With Icons
                </Typography>
                <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
                    <Button variant="primary" startIcon={<Favorite />}>
                        Favorite
                    </Button>
                    <Button variant="secondary" endIcon={<ArrowRight />}>
                        Continue
                    </Button>
                    <Button variant="primary" startIcon={<Favorite />} endIcon={<ArrowRight />}>
                        Both Icons
                    </Button>
                </div>
            </div>
        </div>
    ),
};

/**
 * `startIcon` and `endIcon` accept any `ReactNode`.
 */
export const WithIcons: Story = {
    render: () => (
        <div style={{ display: "flex", gap: "1rem" }}>
            <Button startIcon={<Favorite />}>Start only</Button>
            <Button endIcon={<ArrowRight />}>End only</Button>
            <Button startIcon={<Favorite />} endIcon={<ArrowRight />}>
                Both
            </Button>
        </div>
    ),
};

/**
 * Buttons in a realistic card layout with a heading, description, and action area.
 */
export const CardActions: Story = {
    render: () => (
        <div
            style={{
                maxWidth: 400,
                border: "1px solid #e0e0e0",
                borderRadius: 8,
                padding: "1.5rem",
                display: "flex",
                flexDirection: "column",
                gap: "1rem",
                fontFamily: "system-ui, sans-serif",
            }}
        >
            <Typography variant="headline" element="h3">
                Publish Changes
            </Typography>
            <Typography variant="body">You have 3 unpublished changes. Review and publish them to make them visible on the live site.</Typography>
            <div style={{ display: "flex", gap: "0.75rem", justifyContent: "flex-end", marginTop: "0.5rem" }}>
                <Button variant="secondary">Discard</Button>
                <Button variant="primary" endIcon={<ArrowRight />}>
                    Publish
                </Button>
            </div>
        </div>
    ),
};

/**
 * Buttons inside a confirmation dialog layout.
 */
export const ConfirmationDialog: Story = {
    render: function ConfirmationDialogStory() {
        const [isOpen, setIsOpen] = useState(true);

        if (!isOpen) {
            return <Button onClick={() => setIsOpen(true)}>Reopen Dialog</Button>;
        }

        return (
            <div
                style={{
                    maxWidth: 420,
                    border: "1px solid #e0e0e0",
                    borderRadius: 12,
                    padding: "2rem",
                    boxShadow: "0 4px 24px rgba(0, 0, 0, 0.12)",
                    fontFamily: "system-ui, sans-serif",
                    display: "flex",
                    flexDirection: "column",
                    gap: "1rem",
                }}
            >
                <Typography variant="headline" element="h3">
                    Delete Page?
                </Typography>
                <Typography variant="body">This action cannot be undone. The page and all its content will be permanently removed.</Typography>
                <div style={{ display: "flex", gap: "0.75rem", justifyContent: "flex-end", marginTop: "0.5rem" }}>
                    <Button variant="secondary" onClick={() => setIsOpen(false)}>
                        Cancel
                    </Button>
                    <Button variant="primary" onClick={() => setIsOpen(false)}>
                        Delete
                    </Button>
                </div>
            </div>
        );
    },
};

/**
 * A toolbar-style row of icon-labeled actions.
 */
export const Toolbar: Story = {
    render: () => (
        <div
            style={{
                display: "flex",
                gap: "0.5rem",
                padding: "0.75rem 1rem",
                background: "#f5f5f5",
                borderRadius: 8,
                alignItems: "center",
            }}
        >
            <Button variant="primary" startIcon={<Favorite />}>
                Save
            </Button>
            <Button variant="secondary" startIcon={<ArrowRight />}>
                Preview
            </Button>
            <div style={{ flex: 1 }} />
            <Button variant="secondary" disabled>
                Undo
            </Button>
        </div>
    ),
};

/**
 * Native button props (`onClick`, ARIA attributes, `type`, …) are part of
 * the top-level surface.
 */
export const WithClickHandler: Story = {
    args: {
        children: "Click me",
        onClick: () => {
            window.alert("Clicked");
        },
    },
};
