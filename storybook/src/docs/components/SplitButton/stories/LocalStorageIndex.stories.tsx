import { SplitButton } from "@comet/admin";
import { Button } from "@mui/material";
import * as React from "react";

export default {
    title: "stories/components/Split Button/Persistent Index",
};

export const LocalStorageIndex = () => {
    return (
        <SplitButton variant="contained" color="secondary" localStorageKey="StorylocalStorageIndexSplitButton">
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
};
