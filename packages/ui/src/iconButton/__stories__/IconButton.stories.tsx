import type { Decorator, Meta, StoryObj } from "@storybook/react-vite";
import { expect, fn } from "storybook/test";

import { AddIcon, DeleteIcon, EditIcon, SearchIcon, SettingsIcon } from "#storybook/icons";

import { IconButton } from "../IconButton";
import styles from "./IconButton.stories.module.css";

const iconOptions = {
    AddIcon: <AddIcon />,
    DeleteIcon: <DeleteIcon />,
    EditIcon: <EditIcon />,
    SearchIcon: <SearchIcon />,
    SettingsIcon: <SettingsIcon />,
};

const meta = {
    component: IconButton,
    title: "Components/IconButton",
    args: {
        label: "Edit product",
        children: <EditIcon />,
        onClick: fn(),
    },
    argTypes: {
        label: { control: "text" },
        children: { control: "select", options: Object.keys(iconOptions), mapping: iconOptions },
        variant: { control: "radio", options: ["primary", "secondary", "ghost"] },
        size: { control: "radio", options: ["small", "medium", "large"] },
        className: { control: false },
        slotProps: { control: false },
    },
} satisfies Meta<typeof IconButton>;

export default meta;

type Story = StoryObj<typeof meta>;

const inRow: Decorator = (Story) => (
    <div className={styles.row}>
        <Story />
    </div>
);

/**
 * A ghost icon button, as in a toolbar or a table row. `label` gives it its accessible name.
 *
 * @summary A ghost icon button with a label for screen readers.
 */
export const Default: Story = {
    play: async ({ args, canvas, userEvent }) => {
        const button = canvas.getByRole("button", { name: "Edit product" });
        await expect(button).toHaveAccessibleName(args.label);

        await userEvent.click(button);
        await expect(args.onClick).toHaveBeenCalledOnce();

        await userEvent.keyboard("{Enter}");
        await expect(args.onClick).toHaveBeenCalledTimes(2);
    },
};

/**
 * `ghost` for buttons side by side in a toolbar or a table row, `secondary` for an icon button on its own,
 * `primary` only for the main action of a view.
 *
 * @summary The primary, secondary and ghost variants.
 */
export const Variants: Story = {
    decorators: [inRow],
    render: (args) => (
        <>
            <IconButton {...args} variant="primary" label="Add product">
                <AddIcon />
            </IconButton>
            <IconButton {...args} variant="secondary" label="Open settings">
                <SettingsIcon />
            </IconButton>
            <IconButton {...args} variant="ghost" label="Delete product">
                <DeleteIcon />
            </IconButton>
        </>
    ),
};

/**
 * The width equals the height of a `Button` of the same size, so both line up in a group. Use one size for all
 * buttons in a group.
 *
 * @summary The small, medium and large sizes.
 */
export const Sizes: Story = {
    decorators: [inRow],
    render: (args) => (
        <>
            <IconButton {...args} variant="secondary" size="small" />
            <IconButton {...args} variant="secondary" size="medium" />
            <IconButton {...args} variant="secondary" size="large" />
        </>
    ),
};

/**
 * A disabled icon button doesn't react to clicks. Use `focusableWhenDisabled` to keep it reachable by keyboard.
 *
 * @summary A disabled icon button, which ignores clicks.
 */
export const Disabled: Story = {
    args: {
        disabled: true,
    },
    play: async ({ args, canvas, userEvent }) => {
        await userEvent.click(canvas.getByRole("button", { name: "Edit product" }));
        await expect(args.onClick).not.toHaveBeenCalled();
    },
};
