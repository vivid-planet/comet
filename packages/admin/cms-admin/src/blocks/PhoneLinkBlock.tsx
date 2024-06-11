import { Field, FinalFormInput } from "@comet/admin";
import { BlockCategory, BlockInterface, BlocksFinalForm, createBlockSkeleton, SelectPreviewComponent } from "@comet/blocks-admin";
import * as React from "react";
import { FormattedMessage } from "react-intl";

import { PhoneLinkBlockData, PhoneLinkBlockInput } from "../blocks.generated";
import { isPhoneNumber } from "../validation/isPhoneNumber";

export const PhoneLinkBlock: BlockInterface<PhoneLinkBlockData, PhoneLinkBlockData, PhoneLinkBlockInput> = {
    ...createBlockSkeleton(),

    name: "Phone",

    displayName: <FormattedMessage id="comet.blocks.link.phone" defaultMessage="Phone Number" />,

    defaultValues: () => ({ phone: "" }),

    category: BlockCategory.Navigation,

    isValid: (state) => {
        return state.phone ? isPhoneNumber(state.phone) : true;
    },

    AdminComponent: ({ state, updateState }) => {
        return (
            <SelectPreviewComponent>
                <BlocksFinalForm
                    onSubmit={(newState: PhoneLinkBlockData) => {
                        updateState((prevState) => ({ ...prevState, ...newState }));
                    }}
                    initialValues={state}
                >
                    <Field
                        label={<FormattedMessage id="comet.blocks.link.phone" defaultMessage="Phone Number" />}
                        name="phone"
                        component={FinalFormInput}
                        fullWidth
                        validate={(phone: string) => {
                            if (phone && !isPhoneNumber(phone)) {
                                return <FormattedMessage id="comet.blocks.link.phone.invalid" defaultMessage="Invalid phone number" />;
                            }
                        }}
                    />
                </BlocksFinalForm>
            </SelectPreviewComponent>
        );
    },
    previewContent: (state) => {
        return state.phone ? [{ type: "text", content: state.phone }] : [];
    },
};
