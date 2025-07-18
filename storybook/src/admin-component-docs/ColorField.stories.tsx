import { FinalForm } from "@comet/admin";
import { ColorField } from "@comet/admin-color-picker";
import { ArrowRight } from "@comet/admin-icons";
import { InputAdornment } from "@mui/material";
import { type Meta, type StoryObj } from "@storybook/react-webpack5";

import { argTypes } from "./ColorPicker.stories";
import { commonFieldComponentArgTypes } from "./utils/commonArgTypes";
import { componentDocsDecorator } from "./utils/componentDocsDecorator";
import { DocsPage } from "./utils/DocsPage";

type Story = StoryObj<typeof ColorField>;

const meta: Meta<typeof ColorField> = {
    component: ColorField,
    title: "Component Docs/ColorField",
    decorators: [componentDocsDecorator()],
    parameters: {
        docs: {
            page: () => <DocsPage defaultStory={DefaultStory} />,
        },
    },
    argTypes: {
        ...argTypes,
        ...commonFieldComponentArgTypes,
    },
    args: {
        name: "color",
        label: "Color",
    },
};

export default meta;

/**
 * The `ColorField` component is used to select colors in a final form, e.g., a HEX code or an RGBA string.
 *
 * For usage outside of final form, use the `ColorPicker` component.
 */
export const DefaultStory: Story = {
    render: ({ startAdornment, endAdornment, ...props }) => {
        return (
            <FinalForm mode="edit" onSubmit={() => {}}>
                <ColorField
                    {...props}
                    startAdornment={
                        startAdornment === "ArrowRight" ? (
                            <InputAdornment position="start">
                                <ArrowRight />
                            </InputAdornment>
                        ) : undefined
                    }
                    endAdornment={
                        endAdornment === "ArrowRight" ? (
                            <InputAdornment position="end">
                                <ArrowRight />
                            </InputAdornment>
                        ) : undefined
                    }
                />
            </FinalForm>
        );
    },
};
