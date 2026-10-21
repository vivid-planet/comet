import type { Meta, StoryObj } from "@storybook/react-vite";

import { themeModes } from "#storybook/themeDecorator";
import { ColorTokenTable, TextStyleList, TokenTable } from "#storybook/tokenOverview";

const meta = {
    title: "Foundations/Theme overview/Examples",
    tags: ["!dev", "!autodocs", "!manifest"],
    parameters: {
        chromatic: { modes: themeModes },
    },
} satisfies Meta;

export default meta;

type Story = StoryObj<typeof meta>;

/**
 * Every color token, in the light and the dark color scheme of the theme picked in the toolbar.
 */
export const Colors: Story = {
    render: (_args, { globals }) => <ColorTokenTable theme={String(globals.theme)} />,
};

/**
 * The font families and text styles.
 */
export const Typography: Story = {
    render: (_args, { globals }) => <TextStyleList theme={String(globals.theme)} colorScheme={String(globals.colorScheme)} />,
};

/**
 * The spacing scale.
 */
export const Space: Story = {
    render: (_args, { globals }) => <TokenTable section="Space" theme={String(globals.theme)} colorScheme={String(globals.colorScheme)} />,
};

/**
 * The corner radii.
 */
export const Shape: Story = {
    render: (_args, { globals }) => <TokenTable section="Shape" theme={String(globals.theme)} colorScheme={String(globals.colorScheme)} />,
};

/**
 * The shared metrics of controls.
 */
export const Controls: Story = {
    render: (_args, { globals }) => <TokenTable section="Controls" theme={String(globals.theme)} colorScheme={String(globals.colorScheme)} />,
};

/**
 * The focus ring and the disabled state.
 */
export const State: Story = {
    render: (_args, { globals }) => <TokenTable section="State" theme={String(globals.theme)} colorScheme={String(globals.colorScheme)} />,
};

/**
 * The durations and easing of transitions.
 */
export const Motion: Story = {
    render: (_args, { globals }) => <TokenTable section="Motion" theme={String(globals.theme)} colorScheme={String(globals.colorScheme)} />,
};

/**
 * The button's own tokens, in the color scheme picked in the toolbar.
 */
export const Button: Story = {
    render: (_args, { globals }) => <TokenTable section="Button" theme={String(globals.theme)} colorScheme={String(globals.colorScheme)} />,
};
