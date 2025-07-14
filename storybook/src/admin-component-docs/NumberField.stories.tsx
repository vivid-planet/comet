import { FinalForm, NumberField } from "@comet/admin";
import { type Meta, type StoryObj } from "@storybook/react-webpack5";

import { heightCommunicationDecorator } from "../helpers/storyDecorators";
import { commonFieldComponentArgs, commonFieldComponentArgTypes } from "./utils/common";

type Story = StoryObj<typeof NumberField>;

const config: Meta<typeof NumberField> = {
    component: NumberField,
    title: "Admin Components/NumberField",
    argTypes: {
        clearable: {
            // TODO: Should this be deprecated (work automatically, depending on required and value)?
            control: "boolean",
        },
        decimals: {
            control: "number",
        },
        ...commonFieldComponentArgTypes,
    },
    args: {
        name: "number",
        label: "Number",
        clearable: false,
        ...commonFieldComponentArgs,
    },
    decorators: [heightCommunicationDecorator()],
};

export default config;

/**
 * Used to add a number input to a final form, its value is stored as a number.
 */
export const DefaultStory: Story = {
    render: (props) => {
        return (
            <FinalForm mode="edit" onSubmit={() => {}}>
                <NumberField {...props} />
            </FinalForm>
        );
    },
};
DefaultStory.name = "NumberField";
