import { SplitButton } from "@comet/admin";
import { Button } from "@mui/material";
import * as React from "react";

export default {
    title: "stories/components/Split Button/Color Change",
};

export const ColorChange = {
    render: () => {
        return (
            <SplitButton variant="contained">
                <Button
                    color="primary"
                    onClick={() => {
                        alert("primary clicked");
                    }}
                >
                    Primary Action
                </Button>
                <Button
                    color="secondary"
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
    },

    name: "Color change",
};
