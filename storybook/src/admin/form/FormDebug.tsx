import { Alert } from "@comet/admin";
import { MoreVertical } from "@comet/admin-icons";
import { Checkbox, FormControlLabel, FormGroup, IconButton, Menu, Stack, Typography } from "@mui/material";
import { type FormSubscription } from "final-form";
import { type ReactElement, useState } from "react";
import { FormSpy, type FormSpyRenderProps } from "react-final-form";

interface StateGroup {
    label: string;
    states: Array<keyof FormSubscription>;
}

const stateGroups: StateGroup[] = [
    {
        label: "Form Status",
        states: ["pristine", "dirty", "valid", "invalid", "active", "validating"],
    },
    {
        label: "Submission Status",
        states: ["submitting", "submitSucceeded", "submitFailed"],
    },
    {
        label: "Field States",
        states: ["dirtyFields", "touched", "visited", "modified"],
    },
    {
        label: "Change Tracking",
        states: ["dirtySinceLastSubmit", "modifiedSinceLastSubmit", "dirtyFieldsSinceLastSubmit"],
    },
    {
        label: "Error States",
        states: ["error", "errors", "submitError", "submitErrors", "hasValidationErrors", "hasSubmitErrors"],
    },
    {
        label: "Data",
        states: ["values", "initialValues"],
    },
];
const fullSubscription = stateGroups
    .flatMap((group) => group.states)
    .reduce(
        (acc, state) => ({
            ...acc,
            [state]: true,
        }),
        {},
    );

interface FormDebugProps {
    initialStates?: FormSubscription;
}

const formStateFromDisplayState = (displayStates: FormSubscription, data: FormSpyRenderProps) => {
    return Object.keys(displayStates)
        .filter((key) => {
            const value = displayStates[key as keyof FormSubscription];

            return value != null && value;
        })
        .reduce((previousValue, currentValue) => {
            return { ...previousValue, [currentValue]: data[currentValue as keyof FormSubscription] };
        }, {});
};

export function FormDebug({
    initialStates = {
        values: true,
        errors: true,
        dirty: true,
    },
}: FormDebugProps): ReactElement {
    const [displayStates, setDisplayStates] = useState<FormSubscription>(() => {
        return initialStates;
    });

    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

    const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    const toggleState = (state: keyof FormSubscription) => {
        setDisplayStates((prev) => ({
            ...prev,
            [state]: !prev[state],
        }));
    };

    return (
        <FormSpy subscription={fullSubscription}>
            {(props) => {
                const formState = formStateFromDisplayState(displayStates, props);
                return (
                    <Stack spacing={1}>
                        <Alert
                            severity="info"
                            title={
                                <Stack direction="row" alignItems="center" justifyContent="space-between">
                                    Form State
                                    <IconButton onClick={handleMenuOpen} size="small">
                                        <MoreVertical />
                                    </IconButton>
                                </Stack>
                            }
                            slotProps={{
                                title: { sx: { width: "100%" } },
                                text: {
                                    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                                    // @ts-expect-error
                                    component: "div",
                                },
                            }}
                        >
                            <pre style={{ margin: 0 }}>{JSON.stringify(formState, null, 2)}</pre>
                        </Alert>
                        <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
                            <FormGroup sx={{ p: 2 }}>
                                {stateGroups.map((group) => (
                                    <div key={group.label}>
                                        <Typography variant="subtitle2">{group.label}</Typography>
                                        {group.states.map((state) => (
                                            <FormControlLabel
                                                key={state}
                                                control={<Checkbox checked={!!displayStates[state]} onChange={() => toggleState(state)} />}
                                                label={<Typography variant="body2">{state}</Typography>}
                                            />
                                        ))}
                                    </div>
                                ))}
                            </FormGroup>
                        </Menu>
                    </Stack>
                );
            }}
        </FormSpy>
    );
}
