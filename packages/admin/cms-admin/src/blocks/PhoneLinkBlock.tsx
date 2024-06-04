import { Field, FinalFormInput } from "@comet/admin";
import { BlockCategory, BlockInterface, BlocksFinalForm, createBlockSkeleton, SelectPreviewComponent } from "@comet/blocks-admin";
import * as React from "react";
import { FormattedMessage } from "react-intl";

interface PhoneLinkBlockData {
    phone: string;
}

interface PhoneLinkBlockInput {
    phone: string;
}

export const PhoneLinkBlock: BlockInterface<PhoneLinkBlockData, PhoneLinkBlockData, PhoneLinkBlockInput> = {
    ...createBlockSkeleton(),

    name: "Phone",

    displayName: <FormattedMessage id="comet.blocks.link.phone" defaultMessage="Phone Number" />,

    defaultValues: () => ({ phone: "" }),

    category: BlockCategory.Navigation,

    input2State: (state) => {
        return state;
    },

    state2Output: (state) => {
        return {
            phone: state.phone,
        };
    },

    output2State: async (output) => {
        return {
            phone: output.phone,
        };
    },

    isValid: (state) => {
        return state.phone ? isPhone(state.phone) : true;
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
                            if (phone && !isPhone(phone)) {
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

const isPhone = (text: string) => {
    return !!String(text).match(/^[+]?[0-9]{4,20}$/im);
};
