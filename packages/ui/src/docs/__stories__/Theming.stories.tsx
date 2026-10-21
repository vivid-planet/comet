import type { Meta, StoryObj } from "@storybook/react-vite";

import { Button } from "../../button/Button";
import { Checkbox } from "../../checkbox/Checkbox";
import { Chip } from "../../chip/Chip";
import { Icon } from "../../icon/Icon";
import { IconButton } from "../../iconButton/IconButton";
import { Radio } from "../../radioGroup/Radio";
import { RadioGroup } from "../../radioGroup/RadioGroup";
import { themeOptions } from "../../storybook/themeDecorator";
import { Switch } from "../../switch/Switch";
import { TextField } from "../../textField/TextField";
import { Typography } from "../../typography/Typography";
import styles from "./Theming.stories.module.css";

const meta = {
    title: "Foundations/Theming/Examples",
    tags: ["!dev", "!autodocs", "!manifest"],
} satisfies Meta;

export default meta;

type Story = StoryObj<typeof meta>;

function ThemeSample({ theme }: { theme: string }) {
    return (
        <div className={styles.sample}>
            <div>
                <Typography variant="overline">{theme}</Typography>
                <div className={styles.title}>
                    <Typography variant="heading3" render={<h2 />}>
                        Summer collection
                    </Typography>
                    <Chip tone="success">Published</Chip>
                </div>
                <Typography tone="muted">Linen shirts, canvas sneakers and straw hats for warm days.</Typography>
            </div>
            <TextField label="Email" type="email" description="We send the order confirmation to this address." />
            <RadioGroup label="Delivery" defaultValue="standard">
                <Radio value="standard">Standard</Radio>
                <Radio value="express">Express</Radio>
            </RadioGroup>
            <Checkbox defaultChecked>Subscribe to the newsletter</Checkbox>
            <Switch defaultChecked>Email me when an order is placed</Switch>
            <div className={styles.actions}>
                <Button>Save changes</Button>
                <Button variant="secondary">Cancel</Button>
                <Button variant="ghost">Show details</Button>
                <IconButton label="Edit">
                    <Icon name="edit" />
                </IconButton>
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
                    <ThemeSample theme={theme.title} />
                </section>
            ))}
        </div>
    ),
};
