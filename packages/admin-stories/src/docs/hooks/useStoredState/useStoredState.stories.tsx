import { useStoredState } from "@comet/admin";
import { Button, TextField, Typography } from "@material-ui/core";
import { storiesOf } from "@storybook/react";
import * as React from "react";

storiesOf("stories/hooks/useStoredState", module)
    .add("LocalStorage", () => {
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
    })
    .add("SessionStorage", () => {
        const [storedState, setStoredState] = useStoredState<string>("stored_state_stories_session_storage_key", "☄️ Comet", window.sessionStorage);
        return (
            <div>
                <Typography variant={"h4"}> Stored State: {storedState}</Typography>
                <TextField
                    value={storedState}
                    onChange={(event) => {
                        setStoredState(event.target.value);
                    }}
                />
            </div>
        );
    });
