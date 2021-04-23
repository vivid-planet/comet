import { useStoredState } from "@comet/admin";
import { TextField, Typography } from "@material-ui/core";
import { storiesOf } from "@storybook/react";
import * as React from "react";

storiesOf("@comet/admin/hooks/useStoredState", module).add("Session Storage", () => {
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
