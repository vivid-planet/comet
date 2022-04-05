import { SplitButton } from "@comet/admin";
import { Button } from "@mui/material";
import { storiesOf } from "@storybook/react";
import * as React from "react";

storiesOf("stories/components/Split Button/Uncontrolled", module).add("Uncontrolled", () => {
    return (
        <SplitButton variant={"contained"} color={"primary"}>
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
