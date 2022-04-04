import { SnackbarProvider, useSnackbarApi } from "@comet/admin";
import { UndoSnackbar } from "@comet/admin";
import { ToggleButton, ToggleButtonGroup } from "@mui/material";
import { storiesOf } from "@storybook/react";
import * as React from "react";

const UndoSnackbarExample = () => {
    const [chosenOption, setChosenOption] = React.useState("one");
    const snackbarApi = useSnackbarApi();

    const handleUndo = (prevOption: string) => {
        setChosenOption(prevOption);
    };

    const handleChange = (event: React.MouseEvent<HTMLElement>, newOption: string) => {
        const prevOption = chosenOption;
        setChosenOption(newOption);

        snackbarApi.showSnackbar(
            <UndoSnackbar message={`Changed from ${chosenOption} to ${newOption}`} payload={prevOption} onUndoClick={handleUndo} />,
        );
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
            <UndoSnackbarExample />
        </SnackbarProvider>
    );
}

storiesOf("@comet/admin/snackbar", module).add("Undo Snackbar", () => <Story />);
