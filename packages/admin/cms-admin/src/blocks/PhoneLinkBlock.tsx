import { Field, FinalFormInput } from "@comet/admin";
import { FormattedMessage } from "react-intl";

import { PhoneLinkBlockData, PhoneLinkBlockInput } from "../blocks.generated";
import { isPhoneNumber } from "../validation/isPhoneNumber";
import { validatePhoneNumber } from "../validation/validatePhoneNumber";
import { createBlockSkeleton } from "./blocks/helpers/createBlockSkeleton";
import { BlockCategory, BlockInterface } from "./blocks/types";
import { BlocksFinalForm } from "./form/BlocksFinalForm";
import { SelectPreviewComponent } from "./iframebridge/SelectPreviewComponent";

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
};
