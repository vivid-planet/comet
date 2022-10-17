import { SplitButton } from "@comet/admin";
import { Button } from "@mui/material";
import { storiesOf } from "@storybook/react";
import * as React from "react";

storiesOf("stories/components/Split Button/Override Popover Props", module).add("Override Popover Props", () => {
    return (
        <SplitButton
            variant="contained"
            popoverProps={{
                anchorOrigin: {
                    vertical: "top",
                    horizontal: "right",
                },
                transformOrigin: {
                    vertical: "top",
                    horizontal: "left",
                },
            }}
        >
            <Button
                onClick={() => {
                    alert("primary clicked");
                }}
            >
                Primary Action
            </Button>
            <Button
                onClick={() => {
                    alert("secondary clicked");
                }}
            >
                Secondary Action
            </Button>
        </SplitButton>
    );
});
