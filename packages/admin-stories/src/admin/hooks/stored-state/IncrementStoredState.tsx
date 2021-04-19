import { useStoredState } from "@comet/admin";
import { Button, Typography } from "@material-ui/core";
import { storiesOf } from "@storybook/react";
import * as React from "react";

storiesOf("@comet/admin/hooks/useStoredState", module).add("Local Storage", () => {
    const [storedState, setStoredState] = useStoredState<number>("stored_state_stories_key", 0);
    return (
        <div>
            <Typography variant={"h4"}> Stored State: {storedState}</Typography>

            <Button
                variant={"contained"}
                color={"primary"}
                onClick={() => {
                    setStoredState(storedState + 1);
                }}
            >
                Increment Stored State
            </Button>
            <Button
                color={"primary"}
                onClick={() => {
                    setStoredState(0);
                }}
            >
                Reset
            </Button>
        </div>
    );
});
