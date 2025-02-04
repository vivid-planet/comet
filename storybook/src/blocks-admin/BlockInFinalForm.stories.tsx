import { Field, FinalForm, SaveBoundary } from "@comet/admin";
import { BlockAdminComponentRoot, createFinalFormBlock, createListBlock, ExternalLinkBlock } from "@comet/cms-admin";

import { dndProviderDecorator } from "../dnd.decorator";
import { snackbarDecorator } from "../docs/components/Snackbar/snackbar.decorator";
import { storyRouterDecorator } from "../story-router.decorator";

export default {
    decorators: [snackbarDecorator(), storyRouterDecorator(), dndProviderDecorator()],
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
