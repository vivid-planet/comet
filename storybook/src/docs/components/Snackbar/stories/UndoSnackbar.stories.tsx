import { UndoSnackbar, useSnackbarApi } from "@comet/admin";
import { ToggleButton, ToggleButtonGroup } from "@mui/material";
import { storiesOf } from "@storybook/react";
import * as React from "react";

import { snackbarDecorator } from "../snackbar.decorator";

storiesOf("stories/components/Snackbar/Undo Snackbar", module)
    .addDecorator(snackbarDecorator())
    .add("Undo Snackbar", () => {
        const Story = () => {
            const [chosenOption, setChosenOption] = React.useState<string | undefined>("one");
            const snackbarApi = useSnackbarApi();

            const handleUndo = (prevOption?: string) => {
                setChosenOption(prevOption);
            };
            const handleChange = (event: React.MouseEvent<HTMLElement>, newOption: any) => {
                const prevOption = chosenOption;
                setChosenOption(newOption);
                snackbarApi.showSnackbar(
                    <UndoSnackbar<string> message={`Changed from ${chosenOption} to ${newOption}`} payload={prevOption} onUndoClick={handleUndo} />,
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
        return <Story />;
    });
