import type { Meta, StoryObj } from "@storybook/react-vite";

import { Button } from "../../button/Button";
import { themeOptions } from "../../storybook/themeDecorator";
import styles from "./Theming.stories.module.css";

const meta = {
    title: "Foundations/Theming/Examples",
    tags: ["!dev", "!autodocs", "!manifest"],
} satisfies Meta;

export default meta;

type Story = StoryObj<typeof meta>;

function ThemeSample() {
    return (
        <div className={styles.sample}>
            <div className={styles.actions}>
                <Button>Save changes</Button>
                <Button variant="secondary">Cancel</Button>
                <Button variant="ghost">Show details</Button>
            </div>
        </div>
    );
}

/**
 * The same components in every theme, in the color scheme picked in the toolbar.
 */
export const Comparison: Story = {
    render: (_args, { globals }) => (
        <div className={styles.comparison}>
            {themeOptions.map((theme) => (
                <section
                    key={theme.value}
                    aria-label={theme.title}
                    className={styles.theme}
                    data-dextinity-theme={theme.value}
                    data-dextinity-color-scheme={String(globals.colorScheme)}
                >
                    <ThemeSample />
                </section>
            ))}
        </div>
    ),
};
