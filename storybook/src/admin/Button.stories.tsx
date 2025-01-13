import { Button } from "@comet/admin";
import { Add, Favorite, Wrench } from "@comet/admin-icons";
import { Stack } from "@mui/material";
import { ReactNode } from "react";

export default {
    title: "@comet/admin/Button",
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
                    variant="contained"
                    color="primary"
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
