import { SplitButton } from "@comet/admin";
import { Button } from "@mui/material";
import { storiesOf } from "@storybook/react";
import * as React from "react";

storiesOf("stories/components/Split Button/Persistent Index", module).add("Session Storage Index", () => {
    return (
        <SplitButton
            localStorageKey={"StorySessionStorageIndexSplitButton"}
            storage={window.sessionStorage}
            variant={"contained"}
            color={"secondary"}
        >
            <Button
                onClick={() => {
                    alert("primary clicked");
                }}
            >
                Session Storage - Primary Action
            </Button>
            <Button
                onClick={() => {
                    alert("primary clicked");
                }}
            >
                Session Storage - Secondary Action
            </Button>
            <Button
                onClick={() => {
                    alert("tertiary clicked");
                }}
            >
                Session Storage - Tertiary Action
            </Button>
        </SplitButton>
    );
});
