import { Typography } from "@mui/material";
import { type Meta, type StoryObj } from "@storybook/react-webpack5";

import { componentDocsDecorator } from "./utils/componentDocsDecorator";
import { DocsPage } from "./utils/DocsPage";

type Story = StoryObj<typeof Typography>;

const meta: Meta<typeof Typography> = {
    component: Typography,
    title: "Component Docs/Typography",
    decorators: [componentDocsDecorator()],
    parameters: {
        docs: {
            page: () => <DocsPage defaultStory={DefaultStory} />,
        },
    },
    argTypes: {
        children: {
            control: "text",
        },
        variant: {
            control: "select",
            options: [
                "h1",
                "h2",
                "h3",
                "h4",
                "h5",
                "h6",
                "subtitle1",
                "subtitle2",
                "body1",
                "body2",
                "caption",
                "button",
                "overline",
                "list",
                "listItem",
            ],
        },
    },
    args: {
        children: "Typography content",
    },
};

export default meta;

/**
 * For rendering basic text, use the [Typography](https://mui.com/material-ui/react-typography/) component provided by MUI.
 */
export const DefaultStory: Story = {};

/**
 * When using the theme from `@comet/admin` the following additional variants are available to use when rendering lists:
 *
 * - `list`
 * - `listItem`
 */
export const CustomListVariants: Story = {
    render: (props) => {
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
