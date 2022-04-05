import { SplitButton } from "@comet/admin";
import { Button } from "@mui/material";
import { storiesOf } from "@storybook/react";
import * as React from "react";

storiesOf("stories/components/Split Button/Persistent Index", module).add("Local Storage Index", () => {
    return (
        <SplitButton variant={"contained"} color={"secondary"} localStorageKey={"StorylocalStorageIndexSplitButton"}>
            <Button
                onClick={() => {
                    alert("primary clicked");
                }}
            >
                Local Storage - Primary Action
            </Button>
            <Button
                onClick={() => {
                    alert("secondary clicked");
                }}
            >
                Local Storage - Secondary Action
            </Button>
            <Button
                onClick={() => {
                    alert("tertiary clicked");
                }}
            >
                Local Storage - Tertiary Action
            </Button>
        </SplitButton>
    );
});
