import type { Meta, StoryObj } from "@storybook/react-vite";

import { AddIcon, DeleteIcon, EditIcon, SettingsIcon } from "#storybook/icons";

import { Button } from "../../button/Button";
import { Chip } from "../../chip/Chip";
import { IconButton } from "../../iconButton/IconButton";
import { Typography } from "../../typography/Typography";
import styles from "./Actions.stories.module.css";

const meta = {
    title: "Patterns/Actions/Examples",
    tags: ["!dev", "!autodocs", "!manifest"],
} satisfies Meta;

export default meta;

type Story = StoryObj<typeof meta>;

/**
 * A page header: the title with its status, one primary action and the secondary actions next to it.
 */
export const PageHeader: Story = {
    render: () => (
        <header className={styles.pageHeader}>
            <div className={styles.title}>
                <Typography variant="heading2" render={<h1 />}>
                    Summer collection
                </Typography>
                <Chip tone="warning">Draft</Chip>
            </div>
            <div className={styles.actions}>
                <Button>Publish</Button>
                <Button variant="secondary">Preview</Button>
                <IconButton label="Page settings">
                    <SettingsIcon />
                </IconButton>
            </div>
        </header>
    ),
};

/**
 * A list where every row has the same actions: compact icon buttons, each named by its label.
 */
export const RowActions: Story = {
    render: () => (
        <div className={styles.list}>
            <div className={styles.listToolbar}>
                <Typography variant="heading4" render={<h2 />}>
                    Products
                </Typography>
                <Button size="small" startIcon={<AddIcon />}>
                    Add product
                </Button>
            </div>
            <ul className={styles.rows}>
                {["Linen shirt", "Canvas sneakers"].map((product) => (
                    <li key={product} className={styles.row}>
                        <Typography>{product}</Typography>
                        <div className={styles.rowActions}>
                            <IconButton label={`Edit ${product}`} size="small">
                                <EditIcon />
                            </IconButton>
                            <IconButton label={`Delete ${product}`} size="small">
                                <DeleteIcon />
                            </IconButton>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    ),
};
