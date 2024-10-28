import { SplitButton } from "@comet/admin";
import { Button } from "@mui/material";
import * as React from "react";

export default {
    title: "stories/components/Split Button/Uncontrolled",
};

export const Uncontrolled = () => {
    return (
        <SplitButton variant="contained" color="primary">
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
};
