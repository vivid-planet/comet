import type { Decorator, Meta, StoryObj } from "@storybook/react-vite";
import { expect, waitFor } from "storybook/test";

import { Avatar } from "../Avatar";
import styles from "./Avatar.stories.module.css";

const janesPicture =
    "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 96 96'%3E%3Crect width='96' height='96' fill='%23f4c7a1'/%3E%3Ccircle cx='48' cy='40' r='20' fill='%23a8643d'/%3E%3Cpath d='M12 96c3-22 18-34 36-34s33 12 36 34z' fill='%232f5d8a'/%3E%3C/svg%3E";

const brokenPicture = "data:image/png;base64,broken";

const srcOptions = {
    none: undefined,
    picture: janesPicture,
    "picture that fails to load": brokenPicture,
};

const meta = {
    component: Avatar,
    title: "Components/Avatar",
    // The docs page is Avatar.mdx.
    tags: ["!autodocs"],
    args: {
        name: "Jane Doe",
    },
    argTypes: {
        name: { control: "text" },
        src: { control: "select", options: Object.keys(srcOptions), mapping: srcOptions },
        size: { control: "radio", options: ["small", "medium", "large"] },
        className: { control: false },
        style: { control: false },
        slotProps: { control: false },
    },
} satisfies Meta<typeof Avatar>;

export default meta;

type Story = StoryObj<typeof meta>;

const inRow: Decorator = (Story) => (
    <div className={styles.row}>
        <Story />
    </div>
);

/**
 * A person without a picture, shown by the initials of their name, which assistive technology announces as the
 * name.
 */
export const Default: Story = {
    play: async ({ canvas }) => {
        await expect(canvas.getByRole("img", { name: "Jane Doe" })).toHaveTextContent("JD");
    },
};

/**
 * A person's picture, with their name as its text alternative. The initials show until the picture has loaded.
 */
export const WithAPicture: Story = {
    args: {
        src: janesPicture,
    },
    play: async ({ canvas }) => {
        await waitFor(() => expect(canvas.getByRole("img", { name: "Jane Doe" }).tagName).toBe("IMG"));
        await expect(canvas.queryByText("JD")).not.toBeInTheDocument();
    },
};

/**
 * Use `small` in dense lists and tables, and `large` for the person a page is about. A picture fills the same
 * circle.
 */
export const Sizes: Story = {
    decorators: [inRow],
    render: (args) => (
        <>
            <Avatar {...args} size="small" />
            <Avatar {...args} size="medium" />
            <Avatar {...args} size="large" />
        </>
    ),
};

/**
 * When the picture fails to load, the initials stay, and so does the name for assistive technology.
 */
export const InitialsWhenThePictureFails: Story = {
    args: {
        src: brokenPicture,
    },
    play: async ({ canvasElement, canvas }) => {
        await waitFor(() => expect(canvasElement.querySelector("img")).toHaveAttribute("data-error"));
        await expect(canvas.getAllByRole("img", { name: "Jane Doe" })).toEqual([canvas.getByText("JD")]);
    },
};

/**
 * Next to the person's visible name, the avatar is hidden from assistive technology with `aria-hidden`, so the
 * name is announced once.
 */
export const InAList: Story = {
    args: {
        src: janesPicture,
    },
    render: (args) => (
        <ul className={styles.list}>
            <li className={styles.person}>
                <Avatar {...args} aria-hidden />
                <span>Jane Doe</span>
            </li>
            <li className={styles.person}>
                <Avatar name="Omar Haddad" aria-hidden />
                <span>Omar Haddad</span>
            </li>
            <li className={styles.person}>
                <Avatar name="Lena Novak" aria-hidden />
                <span>Lena Novak</span>
            </li>
        </ul>
    ),
    play: async ({ canvasElement, canvas }) => {
        await waitFor(() => expect(canvas.queryByText("JD")).not.toBeInTheDocument());
        await expect(canvasElement.querySelector("img")).toBeVisible();
        await expect(canvas.queryByRole("img")).not.toBeInTheDocument();
        await expect(canvas.getByText("Lena Novak")).toBeVisible();
    },
};

/**
 * A user without a name, or a name without a letter or digit, is shown by a person icon. Without a name, the
 * avatar is decorative, so assistive technology skips it.
 */
export const WithoutAName: Story = {
    args: {
        name: "",
    },
    play: async ({ canvasElement, canvas }) => {
        await expect(canvas.queryByRole("img")).not.toBeInTheDocument();
        await expect(canvasElement.querySelector(".dextinityAvatar__fallback > .dextinityIcon")).toHaveAttribute("data-icon", "user");
    },
};

/**
 * `className` styles the avatar itself, `slotProps` its inner parts. Both are added to the component's own
 * classes. See "Foundations/Customization" for all ways to adjust a component.
 */
export const CustomizedThroughSlotProps: Story = {
    args: {
        name: "Lena Novak",
        className: styles.ringedAvatar,
        slotProps: {
            fallback: { className: styles.successFallback },
        },
    },
};
