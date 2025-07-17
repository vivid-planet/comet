import { FinalForm, NumberField } from "@comet/admin";
import { type Meta, type StoryObj } from "@storybook/react-webpack5";

import { commonFieldComponentArgTypes } from "./utils/commonFieldComponentArgTypes";
import { componentDocsDecorator } from "./utils/componentDocsDecorator";
import { DocsPage } from "./utils/DocsPage";

type Story = StoryObj<typeof NumberField>;

const meta: Meta<typeof NumberField> = {
    component: NumberField,
    title: "Component Docs/NumberField",
    decorators: [componentDocsDecorator()],
    parameters: {
        docs: {
            page: () => <DocsPage defaultStory={DefaultStory} />,
        },
    },
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
    },
};

export default meta;

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
