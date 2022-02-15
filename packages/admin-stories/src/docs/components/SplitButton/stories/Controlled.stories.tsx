import { SplitButton } from "@comet/admin";
import { Button } from "@mui/material";
import { storiesOf } from "@storybook/react";
import * as React from "react";

storiesOf("stories/components/Split Button/Controlled", module).add("Controlled", () => {
    const [selectedIndex, setSelectedIndex] = React.useState(1);
    return (
        <SplitButton
            variant={"contained"}
            color={"secondary"}
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
});
