import { Field, FinalForm, FinalFormInput, Stack, StackBreadcrumbs, StackLink, StackPage, StackSwitch, useEditDialog } from "@comet/admin";
import { Button } from "@mui/material";
import { storiesOf } from "@storybook/react";
import * as React from "react";

import { apolloRestStoryDecorator } from "../../apollo-rest-story.decorator";
import { storyRouterDecorator } from "../../story-router.decorator";

interface RootPageProps {
    counter: number;
}

const RootPage = ({ counter }: RootPageProps): React.ReactElement => {
    const [EditDialog, selection, editDialogApi, selectionApi] = useEditDialog();

    return (
        <>
            <StackBreadcrumbs />
            <h1>Nested Site {counter}</h1>
            <p>
                Go at least one page down.
                <ul>
                    <li>When using the &apos;Open Dialog Without Deselect&apos;, the stack goes back one page after pressing enter</li>
                    <li>When using the new &apos;Open Dialog With Deselect&apos;, the stack doesn&apos;t go back</li>
                </ul>
            </p>
            <p>
                <StackLink pageName="nested" payload={String(counter + 1)}>
                    To next page
                </StackLink>
            </p>
            <p>
                <Button
                    onClick={() => {
                        editDialogApi.openAddDialog("without_deselect");
                    }}
                >
                    Open Dialog Without Deselect (old)
                </Button>
            </p>
            <p>
                <Button
                    onClick={() => {
                        editDialogApi.openAddDialog("with_deselect");
                    }}
                >
                    Open Dialog With Deselect (new)
                </Button>
            </p>
            <EditDialog>
                {selection.id === "without_deselect" && (
                    <FinalForm
                        mode={selection.mode!}
                        onSubmit={async () => {
                            console.log("submitted without deselect");
                        }}
                    >
                        <Field label="Write something and press enter" name="field" component={FinalFormInput} required />
                    </FinalForm>
                )}
                {selection.id === "with_deselect" && (
                    <FinalForm
                        mode={selection.mode!}
                        onSubmit={async () => {
                            console.log("submitted with deselect");
                        }}
                        onAfterSubmit={() => {
                            // override stackApi.goBack()
                            selectionApi.handleDeselect();
                        }}
                    >
                        <Field label="Write something and press enter" name="field" component={FinalFormInput} required />
                    </FinalForm>
                )}
            </EditDialog>
        </>
    );
};

interface InnerNestedStackProps {
    counter: number;
}

const InnerNestedStack = ({ counter }: InnerNestedStackProps) => {
    const [nestedCounter, setNestedCounter] = React.useState<number>();

    return (
        <StackSwitch initialPage="root">
            <StackPage name="root">
                <RootPage counter={counter} />
            </StackPage>
            <StackPage name="nested" title={`Page ${nestedCounter}`}>
                {(counter) => {
                    setNestedCounter(Number(counter));
                    return <InnerNestedStack counter={Number(counter)} />;
                }}
            </StackPage>
        </StackSwitch>
    );
};

function Story() {
    return (
        <Stack topLevelTitle="Page 1">
            <InnerNestedStack counter={1} />
        </Stack>
    );
}

storiesOf("@comet/admin/edit-dialog", module)
    .addDecorator(storyRouterDecorator())
    .addDecorator(apolloRestStoryDecorator())
    .add("Edit Dialog with Form in Stack", () => <Story />);
