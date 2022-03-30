import { FormSection, useStoredState } from "@comet/admin";
import { Button, InputBase } from "@mui/material";
import { storiesOf } from "@storybook/react";
import * as React from "react";

storiesOf("stories/hooks/useStoredState", module)
    .add("LocalStorage", () => {
        const [storedState, setStoredState] = useStoredState<number>("stored_state_stories_key", 0);
        return (
            <FormSection title={`Stored State: ${storedState}`} disableMarginBottom>
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
            </FormSection>
        );
    })
    .add("SessionStorage", () => {
        const [storedState, setStoredState] = useStoredState<string>("stored_state_stories_session_storage_key", "☄️ Comet", window.sessionStorage);
        return (
            <FormSection title={`Stored State: ${storedState}`} disableMarginBottom>
                <InputBase
                    value={storedState}
                    onChange={(event) => {
                        setStoredState(event.target.value);
                    }}
                />
            </FormSection>
        );
    });
