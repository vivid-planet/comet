import { UndoSnackbar, useSnackbarApi } from "@comet/admin";
import { Button, List, ListItem, Snackbar, ToggleButton, ToggleButtonGroup } from "@mui/material";
import * as React from "react";

import { snackbarDecorator } from "./snackbar.decorator";

export default {
    title: "Docs/Components/Snackbar",
    decorators: [snackbarDecorator()],
};

export const UseSnackbarApi = {
    render: () => {
        const Story = () => {
            const snackbarApi = useSnackbarApi();
            const handleActionButtonClick = () => {
                window.alert("Action button clicked");
                snackbarApi.hideSnackbar();
            };
            const showCustomSnackbar = () => {
                snackbarApi.showSnackbar(
                    <Snackbar
                        anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
                        autoHideDuration={5000}
                        message="This is a completely customizable snackbar"
                        action={
                            <Button color="secondary" size="small" onClick={handleActionButtonClick}>
                                Custom Button
                            </Button>
                        }
                    />,
                );
            };
            return (
                <List>
                    <ListItem>
                        <Button color="primary" onClick={showCustomSnackbar}>
                            Show Snackbar
                        </Button>
                    </ListItem>
                    <ListItem>
                        <Button color="secondary" onClick={snackbarApi.hideSnackbar}>
                            Hide Snackbar
                        </Button>
                    </ListItem>
                </List>
            );
        };
        return <Story />;
    },

    name: "useSnackbarApi()",
};

export const ShowSnackbar = {
    render: () => {
        const snackbarApi = useSnackbarApi();
        const showCustomSnackbar = () => {
            snackbarApi.showSnackbar(
                <Snackbar anchorOrigin={{ vertical: "bottom", horizontal: "left" }} autoHideDuration={5000} message="Minimal snackbar" />,
            );
        };
        return <Button onClick={showCustomSnackbar}>Show Snackbar</Button>;
    },
};

export const HideSnackbar = {
    render: () => {
        const snackbarApi = useSnackbarApi();
        const showCustomSnackbar = () => {
            snackbarApi.showSnackbar(
                <Snackbar anchorOrigin={{ vertical: "bottom", horizontal: "left" }} autoHideDuration={5000} message="Minimal snackbar" />,
            );
        };

        return (
            <List>
                <ListItem>
                    <Button color="primary" onClick={showCustomSnackbar}>
                        Show Snackbar
                    </Button>
                </ListItem>
                <ListItem>
                    <Button color="secondary" onClick={snackbarApi.hideSnackbar}>
                        Hide Snackbar
                    </Button>
                </ListItem>
            </List>
        );
    },
};

export const Undo = {
    render: () => {
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
    },
};
