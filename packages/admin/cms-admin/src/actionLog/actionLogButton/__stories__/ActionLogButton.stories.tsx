import {
    AppHeader,
    AppHeaderMenuButton,
    MainContent,
    MainNavigation,
    MainNavigationItemRouterLink,
    MasterLayout,
    SaveButton,
    Toolbar,
    ToolbarActions,
    ToolbarBackButton,
    ToolbarFillSpace,
    ToolbarTitleItem,
} from "@comet/admin";
import { Dashboard, Store } from "@comet/admin-icons";
import { Stack, TextField, Typography } from "@mui/material";
import type { Meta, StoryObj } from "@storybook/react-vite";

import { ActionLogButton } from "../ActionLogButton";

type ActionLogButtonStoryArgs = {
    id: string;
    rootField: string;
    name?: string;
};

type Story = StoryObj<ActionLogButtonStoryArgs>;

const meta: Meta<ActionLogButtonStoryArgs> = {
    component: ActionLogButton,
    tags: ["!autodocs"],
    title: "Action log/Action log button",
    args: {
        id: "550e8400-e29b-41d4-a716-446655440000",
        rootField: "manufacturer",
        name: "My Page",
    },
};

export default meta;

export const Default: Story = {};

export const CustomLabel: Story = {
    render: (args) => <ActionLogButton {...args}>Show history</ActionLogButton>,
};

const StoryAppHeader = () => (
    <AppHeader>
        <AppHeaderMenuButton />
    </AppHeader>
);

const StoryMainNavigation = () => (
    <MainNavigation>
        <MainNavigationItemRouterLink primary="Dashboard" to="/" icon={<Dashboard />} />
        <MainNavigationItemRouterLink primary="Products" to="/products" icon={<Store />} />
    </MainNavigation>
);

export const InEditPage: Story = {
    render: (args) => (
        <MasterLayout menuComponent={StoryMainNavigation} headerComponent={StoryAppHeader}>
            <Toolbar>
                <ToolbarBackButton />
                <ToolbarTitleItem>{args.name ?? "Product"}</ToolbarTitleItem>
                <ToolbarFillSpace />
                <ToolbarActions>
                    <ActionLogButton {...args} />
                    <SaveButton />
                </ToolbarActions>
            </Toolbar>
            <MainContent>
                <Stack spacing={3} sx={{ maxWidth: 600 }}>
                    <Typography variant="h4">Edit Product</Typography>
                    <TextField label="Name" defaultValue={args.name ?? "My Page"} fullWidth />
                    <TextField label="Slug" defaultValue="my-page" fullWidth />
                    <TextField label="Description" multiline rows={4} fullWidth />
                </Stack>
            </MainContent>
        </MasterLayout>
    ),
};
