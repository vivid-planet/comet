import { SplitButton } from "@comet/admin";
import { Button } from "@mui/material";
import { storiesOf } from "@storybook/react";
import * as React from "react";

storiesOf("stories/components/Split Button/Color Change", module).add("Color change", () => {
    return (
        <SplitButton variant={"contained"}>
            <Button
                color={"primary"}
                onClick={() => {
                    alert("primary clicked");
                }}
            >
                Primary Action
            </Button>
            <Button
                color={"secondary"}
                onClick={() => {
                    alert("secondary clicked");
                }}
            >
                Secondary Action
            </Button>
            <Button
                onClick={() => {
                    alert("tertiary clicked");
                }}
            >
                Tertiary Action
            </Button>
        </SplitButton>
    );
});
