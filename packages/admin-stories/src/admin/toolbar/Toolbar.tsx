import { MasterLayout, Menu, MenuItemRouterLink, RouteWithErrorBoundary, useWindowSize } from "@comet/admin";
import { Search } from "@comet/admin-icons";
import { Box, Typography } from "@material-ui/core";
import { AccountTree, Autorenew, FormatAlignCenter, ListAlt, Texture, Title } from "@material-ui/icons";
import { storiesOf } from "@storybook/react";
import * as React from "react";
import { Redirect, Switch } from "react-router";
import StoryRouter from "storybook-react-router";

import CometLogo from "../../../.storybook/CometLogo";
import { ToolbarAutomaticTitle } from "./samples/ToolbarAutomaticTitle";
import { ToolbarBreadcrumbsSample } from "./samples/ToolbarBreadcrumbs";
import { ToolbarCenteredActions } from "./samples/ToolbarCenteredActions";
import { ToolbarCustomBackButton } from "./samples/ToolbarCustomBackButton";
import { ToolbarSearch } from "./samples/ToolbarSearch";
import { ToolbarShowHideTitle } from "./samples/ToolbarShowHideTitle";
import { ToolbarTableForm } from "./samples/ToolbarTableForm";

const permanentMenuMinWidth = 1024;

const AppMenu: React.FC = () => {
    const windowSize = useWindowSize();

    return (
        <Menu variant={windowSize.width < permanentMenuMinWidth ? "temporary" : "permanent"}>
            <MenuItemRouterLink primary="Automatic Title" icon={<Autorenew />} to="/automaticTitle" />
            <MenuItemRouterLink primary="Show/Hide Title" icon={<Title />} to="/showHideTitle" />
            <MenuItemRouterLink primary="Custom Back Button" icon={<Texture />} to="/customBackButton" />
            <MenuItemRouterLink primary="Breadcrumbs" icon={<AccountTree />} to="/breadcrumbs" />
            <MenuItemRouterLink primary="Search" icon={<Search />} to="/search" />
            <MenuItemRouterLink primary="Table / Form" icon={<ListAlt />} to="/exampleTable" />
            <MenuItemRouterLink primary="Centered Actions Buttons" icon={<FormatAlignCenter />} to="/centeredActions" />
        </Menu>
    );
};

const AppHeader: React.FC = () => (
    <Box display={"flex"} justifyContent={"space-between"} alignItems={"center"} style={{ width: "100%" }}>
        <CometLogo />
        <Typography variant="h5">Toolbar example</Typography>
    </Box>
);

export const Story: React.FC = () => {
    return (
        <MasterLayout headerComponent={AppHeader} menuComponent={AppMenu}>
            <Switch>
                <RouteWithErrorBoundary path="/automaticTitle" component={ToolbarAutomaticTitle} />
                <RouteWithErrorBoundary path="/showHideTitle" component={ToolbarShowHideTitle} />
                <RouteWithErrorBoundary path="/customBackButton" component={ToolbarCustomBackButton} />
                <RouteWithErrorBoundary path="/breadcrumbs" component={ToolbarBreadcrumbsSample} />
                <RouteWithErrorBoundary path="/search" component={ToolbarSearch} />
                <RouteWithErrorBoundary path="/exampleTable" component={ToolbarTableForm} />
                <RouteWithErrorBoundary path="/centeredActions" component={ToolbarCenteredActions} />
                <Redirect to={"/automaticTitle"} />
            </Switch>
        </MasterLayout>
    );
};

storiesOf("@comet/admin/toolbar", module)
    .addDecorator(StoryRouter())
    .add("Toolbar", () => <Story />);
