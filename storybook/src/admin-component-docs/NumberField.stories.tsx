import { FinalForm, NumberField } from "@comet/admin";
import { type Meta, type StoryObj } from "@storybook/react-webpack5";

import { heightCommunicationDecorator } from "../helpers/storyDecorators";

type Story = StoryObj<typeof NumberField>;

// TODO: Move to common place for use in all field components
const commonFieldArgTypes = {
    name: {
        control: "text",
    },
    label: {
        control: "text",
    },
    // TODO: Should we also include error and warning? (doesn't seem to work out of the box)
    helperText: {
        control: "text",
    },
    placeholder: {
        control: "text",
    },
    required: {
        control: "boolean",
    },
    disabled: {
        control: "boolean",
    },
    variant: {
        // TODO: Make this work - currently ignored
        control: "select",
        options: ["vertical", "horizontal"],
    },
    fullWidth: {
        control: "boolean",
    },
} as const;

// TODO: Move to common place for use in all field components
const commonFieldArgs = {
    required: false,
    disabled: false,
    fullWidth: false,
} as const;

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
        ...commonFieldArgTypes,
    },
    args: {
        name: "number",
        label: "Number",
        clearable: false,
        ...commonFieldArgs,
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
