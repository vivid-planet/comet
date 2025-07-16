import { FieldSet } from "@comet/admin";
import { Chip } from "@mui/material";
import { type Meta, type StoryObj } from "@storybook/react-webpack5";

import { commonComponentDocsMeta } from "./utils/commonComponentDocsMeta";

type Story = StoryObj<typeof FieldSet>;

const meta: Meta<typeof FieldSet> = {
    ...commonComponentDocsMeta,
    component: FieldSet,
    title: "Admin Components/FieldSet",
    argTypes: {
        // TODO: Can we move the prop descriptions to the component itself?
        title: {
            control: "text",
            description: "Title of the FieldSet",
        },
        supportText: {
            control: "text",
            description: "Additional line below the Title",
        },
        endAdornment: {
            control: "select",
            options: [undefined, "Text in Chip"],
            description: "An element on the right end of the FieldSetSummary",
        },
        collapsible: {
            control: "boolean",
            description: "If true, FieldSet can be opened and closed (Accordion behavior)",
        },
        initiallyExpanded: {
            control: "boolean",
            description: "If false, FieldSet is closed by default",
        },
        disablePadding: {
            control: "boolean",
            description: "If true, content will have no padding",
        },
    },
    args: {
        title: "FieldSet Title",
        children: "FieldSet content",
    },
};

export default meta;

// @ts-expect-error TODO: Can we fix this type?
Chip.displayName = "Chip";

/**
 * The `FieldSet` component is intended for better structuring of big forms.
 * It allows the user to show and hide sections of related content on a page.
 */
export const DefaultStory: Story = {
    render: ({ endAdornment, ...props }) => {
        return <FieldSet {...props} endAdornment={endAdornment === "Text in Chip" ? <Chip label="Text in Chip" /> : undefined} />;
    },
};
