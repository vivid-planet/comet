import { Button, ButtonProps } from "@comet/admin";
import { Favorite, Wrench } from "@comet/admin-icons";
import { Box, Stack } from "@mui/material";

export default {
    title: "@comet/admin/Button",
};

type DefaultStoryArgs = {
    variant: ButtonProps["variant"];
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
        disabled: false,
        startIcon: true,
        endIcon: false,
    },
    argTypes: {
        variant: {
            name: "Variant",
            control: "select",
            options: ["primary", "secondary", "outlined", "descructive", "success", "textLight", "textDark"],
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

    render: ({ startIcon, endIcon, disabled, variant }: DefaultStoryArgs) => {
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
                <Button variant="descructive">Descructive</Button>
                <Button variant="success">Success</Button>
                <Button variant="textLight">Text Light</Button>
                <Button variant="textDark">Text Dark</Button>
            </Stack>
        );
    },
};
