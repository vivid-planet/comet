import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { expect } from "storybook/test";

import { themeModes } from "#storybook/themeDecorator";

import { Icon } from "../../icon/Icon";
import { iconNames } from "../../icon/iconNames";
import { TextField } from "../../textField/TextField";
import { Typography } from "../../typography/Typography";
import styles from "./Icons.stories.module.css";

function IconGallery() {
    const [query, setQuery] = useState("");
    const normalizedQuery = query.trim().toLowerCase();
    const matchingNames = iconNames.filter((iconName) => iconName.includes(normalizedQuery));

    return (
        <div className={styles.gallery}>
            <TextField
                label="Search icons"
                type="search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                className={styles.search}
            />
            <Typography tone="muted" variant="bodySmall" aria-live="polite">
                {matchingNames.length === 1 ? "1 icon" : `${matchingNames.length} icons`}
            </Typography>
            {matchingNames.length > 0 ? (
                <ul className={styles.grid}>
                    {matchingNames.map((iconName) => (
                        <li key={iconName} className={styles.tile}>
                            <Icon name={iconName} className={styles.icon} />
                            <code className={styles.name}>{iconName}</code>
                        </li>
                    ))}
                </ul>
            ) : (
                <Typography>No icon matches “{query}”.</Typography>
            )}
        </div>
    );
}

const meta = {
    title: "Foundations/Icons/Examples",
    tags: ["!dev", "!autodocs", "!manifest"],
    parameters: {
        chromatic: { modes: themeModes },
    },
} satisfies Meta;

export default meta;

type Story = StoryObj<typeof meta>;

/**
 * Every icon of the icon set in the theme picked in the toolbar, filtered by the search.
 */
export const Gallery: Story = {
    render: () => <IconGallery />,
    play: async ({ canvas, userEvent }) => {
        await userEvent.type(canvas.getByRole("searchbox", { name: "Search icons" }), "chevron");
        await expect(canvas.getAllByRole("listitem")).toHaveLength(4);
        await userEvent.clear(canvas.getByRole("searchbox", { name: "Search icons" }));
        await userEvent.type(canvas.getByRole("searchbox", { name: "Search icons" }), "unicorn");
        await expect(canvas.getByText("No icon matches “unicorn”.")).toBeVisible();
    },
};
