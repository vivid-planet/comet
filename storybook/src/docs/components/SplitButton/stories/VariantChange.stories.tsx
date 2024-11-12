import { SplitButton } from "@comet/admin";
import { Button } from "@mui/material";
import * as React from "react";

export default {
    title: "stories/components/Split Button/Variant Change",
};

export const VariantChange = {
    render: () => {
        return (
            <SplitButton color="primary">
                <Button
                    variant="contained"
                    onClick={() => {
                        alert("primary clicked");
                    }}
                >
                    Primary Action
                </Button>
                <Button
                    variant="outlined"
                    onClick={() => {
                        alert("secondary clicked");
                    }}
                >
                    Secondary Action
                </Button>
                <Button
                    variant="text"
                    onClick={() => {
                        alert("tertiary clicked");
                    }}
                >
                    Tertiary Action
                </Button>
            </SplitButton>
        );
    },

    name: "Variant change",
};
