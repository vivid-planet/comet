import { Field, FinalFormInput } from "@comet/admin";
import { BlockCategory, BlockInterface, BlocksFinalForm, createBlockSkeleton, SelectPreviewComponent } from "@comet/blocks-admin";
import { isEmail } from "class-validator";
import { FormattedMessage } from "react-intl";

import { EmailLinkBlockData, EmailLinkBlockInput } from "../blocks.generated";

export const EmailLinkBlock: BlockInterface<EmailLinkBlockData, EmailLinkBlockData, EmailLinkBlockInput> = {
    ...createBlockSkeleton(),

    name: "EmailLink",

    displayName: <FormattedMessage id="comet.blocks.link.email" defaultMessage="Email" />,

    defaultValues: () => ({ email: undefined }),

    category: BlockCategory.Navigation,

    isValid: (state) => {
        return state.email ? isEmail(state.email) : true;
    },

    AdminComponent: ({ state, updateState }) => {
        return (
            <SelectPreviewComponent>
                <BlocksFinalForm onSubmit={updateState} initialValues={state}>
                    <Field
                        label={<FormattedMessage id="comet.blocks.link.email" defaultMessage="Email" />}
                        name="email"
                        component={FinalFormInput}
                        fullWidth
                        validate={(email: string) => {
                            if (email && !isEmail(email)) {
                                return <FormattedMessage id="comet.blocks.link.email.invalid" defaultMessage="Invalid e-mail address" />;
                            }
                        }}
                    />
                </BlocksFinalForm>
            </SelectPreviewComponent>
        );
    },

    previewContent: (state) => {
        return state.email ? [{ type: "text", content: state.email }] : [];
    },

    extractTextContents: (state) => {
        return state.email ? [state.email] : [];
    },
};
