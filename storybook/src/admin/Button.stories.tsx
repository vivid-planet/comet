import { Button, type ButtonProps } from "@comet/admin";
import { Add, Favorite, Wrench } from "@comet/admin-icons";
import { Box, Stack } from "@mui/material";
import { type ReactNode } from "react";

export default {
    title: "@comet/admin/Button",
};

type DefaultStoryArgs = {
    variant: ButtonProps["variant"];
    responsive: boolean;
    disabled: boolean;
    startIcon: boolean;
    endIcon: boolean;
};

export const Default = {
    parameters: {
        layout: "fullscreen",
    },
    args: {
        variant: "primary",
        responsive: false,
        disabled: false,
        startIcon: true,
        endIcon: false,
    },
    argTypes: {
        variant: {
            name: "Variant",
            control: "select",
            options: ["primary", "secondary", "outlined", "destructive", "success", "textLight", "textDark"],
        },
        responsive: {
            name: "Responsive",
            control: "boolean",
        },
        disabled: {
            name: "Disabled",
            control: "boolean",
        },
        startIcon: {
            name: "Start Icon",
            control: "boolean",
        },
        endIcon: {
            name: "End Icon",
            control: "boolean",
        },
    },

    render: ({ startIcon, endIcon, disabled, variant, responsive }: DefaultStoryArgs) => {
        const showDarkBackground = variant === "textLight";

        return (
            <Box py={10} px={8} bgcolor={showDarkBackground ? "#333" : "transparent"}>
                <Button
                    onClick={() => {
                        alert("Button clicked");
                    }}
                    startIcon={startIcon ? <Wrench /> : undefined}
                    endIcon={endIcon ? <Favorite /> : undefined}
                    disabled={disabled}
                    variant={variant}
                    responsive={responsive}
                >
                    This is a button
                </Button>
            </Box>
        );
    },
};

export const AllVariants = {
    render: () => {
        return (
            <Stack direction="row" spacing={2}>
                <Button variant="primary">Primary</Button>
                <Button variant="secondary">Secondary</Button>
                <Button variant="outlined">Outlined</Button>
                <Button variant="destructive">Destructive</Button>
                <Button variant="success">Success</Button>
                <Button variant="textLight">Text Light</Button>
                <Button variant="textDark">Text Dark</Button>
            </Stack>
        );
    },
};

type ResponsiveArgs = {
    startIcon: boolean;
    endIcon: boolean;
    mobileIcon: "auto" | "startIcon" | "endIcon" | ReactNode;
    mobileBreakpoint: "xs" | "sm" | "md" | "lg" | "xl";
    disabled: boolean;
};

export const Responsive = {
    args: {
        startIcon: true,
        endIcon: false,
        mobileIcon: "auto",
        mobileBreakpoint: "sm",
        disabled: false,
    },
    argTypes: {
        startIcon: {
            name: "Start Icon",
            control: "boolean",
        },
        endIcon: {
            name: "End Icon",
            control: "boolean",
        },
        mobileIcon: {
            name: "Mobile Icon",
            control: "select",
            options: ["auto", "startIcon", "endIcon", "custom"],
        },
        mobileBreakpoint: {
            name: "Mobile Breakpoint",
            control: "select",
            options: ["xs", "sm", "md", "lg", "xl"],
        },
        disabled: {
            name: "Disabled",
            control: "boolean",
        },
    },
    render: ({ startIcon, endIcon, mobileIcon, mobileBreakpoint, disabled }: ResponsiveArgs) => {
        const customMobileIcon = <Favorite />;

        return (
            <Stack direction="row" spacing={2}>
                <Button
                    responsive
                    startIcon={startIcon ? <Wrench /> : undefined}
                    endIcon={endIcon ? <Add /> : undefined}
                    mobileIcon={mobileIcon === "custom" ? customMobileIcon : mobileIcon}
                    mobileBreakpoint={mobileBreakpoint}
                    disabled={disabled}
                >
                    This is a responsive button
                </Button>
            </Stack>
        );
    },
};
