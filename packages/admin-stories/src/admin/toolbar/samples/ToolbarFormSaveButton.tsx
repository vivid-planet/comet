import {
    Field,
    FinalForm,
    FinalFormInput,
    FormSaveSplitButton,
    MainContent,
    Stack,
    StackPage,
    StackSwitch,
    StackSwitchApiContext,
    Toolbar,
    ToolbarActions,
    ToolbarAutomaticTitleItem,
    ToolbarBackButton,
    ToolbarFillSpace,
    ToolbarItem,
} from "@comet/admin";
import { Button, Typography } from "@material-ui/core";
import * as React from "react";

export const ToolbarFormSaveButton = () => {
    const ExampleTable = () => {
        return (
            <>
                <Toolbar>
                    <ToolbarBackButton />
                    <ToolbarAutomaticTitleItem />
                    <ToolbarFillSpace />
                    <ToolbarActions>
                        <StackSwitchApiContext.Consumer>
                            {(stackSwitchApi) => (
                                <>
                                    <Button
                                        variant={"contained"}
                                        color={"primary"}
                                        onClick={() => {
                                            stackSwitchApi?.activatePage("create", "new");
                                        }}
                                    >
                                        <Typography>Details</Typography>
                                    </Button>
                                </>
                            )}
                        </StackSwitchApiContext.Consumer>
                    </ToolbarActions>
                </Toolbar>
                <MainContent>
                    <div>content</div>
                </MainContent>
            </>
        );
    };
    const ExampleDetails = ({ mode, id }: { mode: "edit" | "create"; id: string }) => {
        const [saving, setSaving] = React.useState(false);
        const handleSaveClick = (values: any) => {
            console.log("Handle Save", values);
            return new Promise<void>((resolve) => {
                setSaving(true);
                setTimeout(() => {
                    setSaving(false);
                    resolve();
                }, 500);
            });
        };

        return (
            <FinalForm
                mode={"add"}
                onSubmit={handleSaveClick}
                onAfterSubmit={(values, form) => {
                    form.reset(values);
                }}
            >
                <Toolbar>
                    <ToolbarBackButton />
                    <ToolbarItem>
                        <Typography variant={"h4"}>Details</Typography>
                    </ToolbarItem>
                    <ToolbarFillSpace />
                    <ToolbarActions>
                        <FormSaveSplitButton localStorageKey={"toolbarFormSaveButton"} saving={saving} hasErrors={false} />
                    </ToolbarActions>
                </Toolbar>
                <MainContent>
                    <Field label={"Message"} name="message" required component={FinalFormInput} fullWidth />
                </MainContent>
            </FinalForm>
        );
    };

    return (
        <Stack topLevelTitle={"Table / Form"}>
            <StackSwitch initialPage="table">
                <StackPage name="table">
                    <ExampleTable />
                </StackPage>
                <StackPage name="create">
                    {(selectedId: string) => {
                        return <ExampleDetails mode={"create"} id={selectedId} />;
                    }}
                </StackPage>

                <StackPage name="edit">
                    {(selectedId: string) => {
                        return <ExampleDetails mode="edit" id={selectedId} />;
                    }}
                </StackPage>
            </StackSwitch>
        </Stack>
    );
};
