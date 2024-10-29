import { SplitButton } from "@comet/admin";
import { Button } from "@mui/material";
import * as React from "react";

export default {
    title: "stories/components/Split Button/Controlled",
};

export const Controlled = () => {
    const [selectedIndex, setSelectedIndex] = React.useState(1);
    return (
        <SplitButton
            variant="contained"
            color="secondary"
            selectedIndex={selectedIndex}
            onSelectIndex={(index: number) => {
                setSelectedIndex(index);
            }}
        >
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
