import { SnackbarProvider } from "@comet/admin";
import { useUndoSnackbar } from "@comet/admin";
import { ToggleButton, ToggleButtonGroup } from "@material-ui/lab";
import { storiesOf } from "@storybook/react";
import * as React from "react";

let counter = 0;

const UndoSnackbar = () => {
    const [chosenOption, setChosenOption] = React.useState("one");
    const undoSnackbarApi = useUndoSnackbar();

    const handleUndo = (prevOption: string) => {
        setChosenOption(prevOption);
    };

    const handleChange = (event: React.MouseEvent<HTMLElement>, newOption: string) => {
        undoSnackbarApi.showUndoSnackbar({
            // Use uuid or object id in production
            key: counter++,
            message: `Changed from ${chosenOption} to ${newOption}`,
            // Payload is passed into onActionButtonClick method
            payload: chosenOption,
            onUndoClick: handleUndo,
        });

        setChosenOption(newOption);
    };

    return (
        <>
            <strong>Choose another option:</strong>
            <br />
            <br />
            <ToggleButtonGroup value={chosenOption} exclusive onChange={handleChange}>
                <ToggleButton value="one">One</ToggleButton>
                <ToggleButton value="two">Two</ToggleButton>
                <ToggleButton value="three">Three</ToggleButton>
            </ToggleButtonGroup>
        </>
    );
};

function Story() {
    return (
        <SnackbarProvider>
            <UndoSnackbar />
        </SnackbarProvider>
    );
}

storiesOf("@comet/admin/snackbar", module).add("Undo Snackbar", () => <Story />);
