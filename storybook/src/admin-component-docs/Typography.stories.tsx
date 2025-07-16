import { Typography } from "@mui/material";
import { type Meta, type StoryObj } from "@storybook/react-webpack5";

import { heightCommunicationDecorator } from "../helpers/storyDecorators";

type Story = StoryObj<typeof Typography>;

const config: Meta<typeof Typography> = {
    component: Typography,
    title: "Admin Components/Typography",
    argTypes: {
        children: {
            control: "text",
        },
        variant: {
            control: "select",
            options: ["list", "listItem"],
        },
    },
    args: {
        children: "Typography content",
    },
    decorators: [heightCommunicationDecorator()],
};

export default config;

// @ts-expect-error TODO: Can we fix this type?
Typography.displayName = "Typography";

/**
 * For rendering basic text, use the [Typography](https://mui.com/material-ui/react-typography/) component provided by MUI.
 */
export const DefaultStory: Story = {};
DefaultStory.name = "Typography";

/**
 * When using the theme from `@comet/admin` the following additional variants are available to use when rendering lists:
 *
 * - `list`
 * - `listItem`
 */
export const ListVariants: Story = {
    render: (props) => {
        // TODO: Fix this story, the typographyies are all redndered as `span` instead of `ul`/`li`.
        return (
            <>
                <Typography>You can add unordered lists:</Typography>
                <Typography variant="list">
                    <Typography variant="listItem">A</Typography>
                    <Typography variant="listItem">B</Typography>
                    <Typography variant="listItem">C</Typography>
                </Typography>
                <Typography>Or ordered lists:</Typography>
                <Typography variant="list" component="ol">
                    <Typography variant="listItem">One</Typography>
                    <Typography variant="listItem">Two</Typography>
                    <Typography variant="listItem">Three</Typography>
                </Typography>
            </>
        );
    },
};
ListVariants.name = "Custom list variants";
