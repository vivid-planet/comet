import { MainContent, MasterLayout } from "@dextinity/admin";
import { DextinityIcon, DextinityLogo } from "@dextinity/admin-icons";
import { Typography } from "@mui/material";
import type { Meta, StoryObj } from "@storybook/react-vite";
import type { ComponentType } from "react";

import { Header } from "../Header";
import { UserHeaderItem } from "../UserHeaderItem";

type Story = StoryObj<typeof Header>;

const config: Meta<typeof Header> = {
    component: Header,
    title: "common/header/Header",
};

export default config;

const EmptyMenu = () => null;

/**
 * `Header` renders an `AppHeader`, which reads its height from `MasterLayout` — rendered on its own it collapses to
 * 0px. This mirrors how an application composes it.
 */
const renderInMasterLayout = (headerComponent: ComponentType) => () => (
    <MasterLayout headerComponent={headerComponent} menuComponent={EmptyMenu}>
        <MainContent>
            <Typography>Page content</Typography>
        </MainContent>
    </MasterLayout>
);

const DefaultHeader = () => <Header />;

/** The default logo is the negative wordmark, since the app header has a dark background. */
export const Default: Story = {
    render: renderInMasterLayout(DefaultHeader),
};

const HeaderWithUserHeaderItem = () => (
    <Header>
        <UserHeaderItem />
    </Header>
);

/** The full composition: logo on the left, user menu on the right. "About/Copyright" opens the `AboutModal`. */
export const WithUserHeaderItem: Story = {
    render: renderInMasterLayout(HeaderWithUserHeaderItem),
};

const HeaderWithIconLogo = () => <Header logo={<DextinityIcon sx={{ fontSize: 32 }} />} />;

/** Applications can replace the logo entirely via the `logo` prop. */
export const CustomLogo: Story = {
    render: renderInMasterLayout(HeaderWithIconLogo),
};

const HeaderWithFlatLogo = () => <Header logo={<DextinityLogo variant="secondaryFlat" htmlColor="white" sx={{ fontSize: 30 }} />} />;

/** The flat variant inherits `currentColor`, so it can be tinted to match a custom header color. */
export const CustomLogoFlat: Story = {
    render: renderInMasterLayout(HeaderWithFlatLogo),
};
