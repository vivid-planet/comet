import { MjmlColumn, MjmlText } from "@faire/mjml-react";
import type { Meta, StoryObj } from "@storybook/react-vite";

import { MjmlSection } from "../../section/MjmlSection.js";
import { MjmlMailRoot } from "../MjmlMailRoot.js";

type Story = StoryObj<typeof MjmlMailRoot>;

const config: Meta<typeof MjmlMailRoot> = {
    title: "Components/MjmlMailRoot",
    component: MjmlMailRoot,
    tags: ["autodocs"],
};

export default config;

export const Basic: Story = {
    render: () => (
        <MjmlMailRoot>
            <MjmlSection>
                <MjmlColumn>
                    <MjmlText>Hello from MjmlMailRoot</MjmlText>
                </MjmlColumn>
            </MjmlSection>
        </MjmlMailRoot>
    ),
};
