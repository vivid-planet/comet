import { SplitButton } from "@comet/admin";
import { Button } from "@mui/material";
import * as React from "react";

export default {
    title: "stories/components/Split Button/One Child",
};

export const OneChild = () => {
    return (
        <SplitButton variant="contained" color="primary">
            <Button
                onClick={() => {
                    alert("primary clicked");
                }}
            >
                Primary Action
            </Button>
        </SplitButton>
    );
};

OneChild.storyName = "One child";

export const OneChildWithSelect = () => {
    return (
        <SplitButton showSelectButton={true} variant="contained" color="primary">
            <Button
                onClick={() => {
                    alert("primary clicked");
                }}
            >
                Primary Action
            </Button>
        </SplitButton>
    );
};

OneChildWithSelect.storyName = "One child with select";

export const OneChildDisabled = () => {
    return (
        <SplitButton disabled={true} variant="contained" color="primary">
            <Button
                onClick={() => {
                    alert("primary clicked");
                }}
            >
                Primary Action
            </Button>
        </SplitButton>
    );
};

OneChildDisabled.storyName = "One child disabled";
