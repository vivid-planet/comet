import { SplitButton } from "@comet/admin";
import { Button } from "@mui/material";
import { storiesOf } from "@storybook/react";
import * as React from "react";

storiesOf("stories/components/Split Button/One Child", module)
    .add("One child", () => {
        return (
            <SplitButton variant={"contained"} color={"primary"}>
                <Button
                    onClick={() => {
                        alert("primary clicked");
                    }}
                >
                    Primary Action
                </Button>
            </SplitButton>
        );
    })
    .add("One child with select", () => {
        return (
            <SplitButton showSelectButton={true} variant={"contained"} color={"primary"}>
                <Button
                    onClick={() => {
                        alert("primary clicked");
                    }}
                >
                    Primary Action
                </Button>
            </SplitButton>
        );
    })
    .add("One child disabled", () => {
        return (
            <SplitButton disabled={true} variant={"contained"} color={"primary"}>
                <Button
                    onClick={() => {
                        alert("primary clicked");
                    }}
                >
                    Primary Action
                </Button>
            </SplitButton>
        );
    });
