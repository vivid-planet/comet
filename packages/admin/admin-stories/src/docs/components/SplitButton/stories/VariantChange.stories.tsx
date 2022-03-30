import { SplitButton } from "@comet/admin";
import { Button } from "@mui/material";
import { storiesOf } from "@storybook/react";
import * as React from "react";

storiesOf("stories/components/Split Button/Variant Change", module).add("Variant change", () => {
    return (
        <SplitButton color={"primary"}>
            <Button
                variant={"contained"}
                onClick={() => {
                    alert("primary clicked");
                }}
            >
                Primary Action
            </Button>
            <Button
                variant={"outlined"}
                onClick={() => {
                    alert("secondary clicked");
                }}
            >
                Secondary Action
            </Button>
            <Button
                variant={"text"}
                onClick={() => {
                    alert("tertiary clicked");
                }}
            >
                Tertiary Action
            </Button>
        </SplitButton>
    );
});
