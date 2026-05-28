import { Field, FinalForm, SaveBoundary, SnackbarProvider } from "@comet/admin";
import { BlockAdminComponentRoot, createFinalFormBlock, createListBlock, ExternalLinkBlock } from "@comet/cms-admin";
import type { Decorator } from "@storybook/react-vite";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

const snackbarDecorator: Decorator = (Story) => (
    <SnackbarProvider>
        <Story />
    </SnackbarProvider>
);

const dndProviderDecorator: Decorator = (Story) => (
    <DndProvider backend={HTML5Backend}>
        <Story />
    </DndProvider>
);

export default {
    decorators: [snackbarDecorator, dndProviderDecorator],
};

export const BlockInFinalFormWithSaveBoundary = () => {
    const LinkListBlock = createListBlock({ name: "LinkList", block: ExternalLinkBlock });
    const FinalFormLinkListBlock = createFinalFormBlock(LinkListBlock);

    return (
        <SaveBoundary>
            <FinalForm mode="edit" onSubmit={() => {}} initialValues={{ links: LinkListBlock.defaultValues() }}>
                <BlockAdminComponentRoot>
                    <Field name="links" component={FinalFormLinkListBlock} fullWidth />
                </BlockAdminComponentRoot>
            </FinalForm>
        </SaveBoundary>
    );
};

export const BlockInFinalFormWithoutSaveBoundary = () => {
    const LinkListBlock = createListBlock({ name: "LinkList", block: ExternalLinkBlock });
    const FinalFormLinkListBlock = createFinalFormBlock(LinkListBlock);

    return (
        <FinalForm mode="edit" onSubmit={() => {}} initialValues={{ links: LinkListBlock.defaultValues() }}>
            <BlockAdminComponentRoot>
                <Field name="links" component={FinalFormLinkListBlock} fullWidth />
            </BlockAdminComponentRoot>
        </FinalForm>
    );
};
