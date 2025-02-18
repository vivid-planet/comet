import { Field, FinalFormInput } from "@comet/admin";
import { BlockCategory, BlockInterface, BlocksFinalForm, createBlockSkeleton, SelectPreviewComponent } from "@comet/blocks-admin";
import { FormattedMessage } from "react-intl";

import { PhoneLinkBlockData, PhoneLinkBlockInput } from "../blocks.generated";
import { isPhoneNumber } from "../validation/isPhoneNumber";
import { validatePhoneNumber } from "../validation/validatePhoneNumber";

export const PhoneLinkBlock: BlockInterface<PhoneLinkBlockData, PhoneLinkBlockData, PhoneLinkBlockInput> = {
    ...createBlockSkeleton(),

    name: "PhoneLink",

    displayName: <FormattedMessage id="comet.blocks.link.phone" defaultMessage="Phone Number" />,

    defaultValues: () => ({ phone: undefined }),

    category: BlockCategory.Navigation,

    isValid: (state) => {
        return state.phone ? isPhoneNumber(state.phone) : true;
    },

    AdminComponent: ({ state, updateState }) => {
        return (
            <SelectPreviewComponent>
                <BlocksFinalForm onSubmit={updateState} initialValues={state}>
                    <Field
                        label={<FormattedMessage id="comet.blocks.link.phone" defaultMessage="Phone Number" />}
                        name="phone"
                        component={FinalFormInput}
                        fullWidth
                        validate={validatePhoneNumber}
                    />
                </BlocksFinalForm>
            </SelectPreviewComponent>
        );
    },

    previewContent: (state) => {
        return state.phone ? [{ type: "text", content: state.phone }] : [];
    },

    extractTextContents: (state) => {
        return state.phone ? [state.phone] : [];
    },
};
