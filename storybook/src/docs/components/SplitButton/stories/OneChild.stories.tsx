import { SplitButton } from "@comet/admin";
import { Button } from "@mui/material";
import * as React from "react";

export default {
    title: "stories/components/Split Button/One Child",
};

export const OneChild = {
    render: () => {
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
    },

    name: "One child",
};

export const OneChildWithSelect = {
    render: () => {
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
    },

    name: "One child with select",
};

export const OneChildDisabled = {
    render: () => {
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
    },

    name: "One child disabled",
};
