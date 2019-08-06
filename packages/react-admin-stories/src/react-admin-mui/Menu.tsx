import { Typography } from "@material-ui/core";
import { CalendarToday, Home, School, Settings } from "@material-ui/icons";
import { storiesOf } from "@storybook/react";
import { Master, Menu, MenuCollapsibleItem, MenuItemRouterLink } from "@vivid-planet/react-admin-mui";
import * as React from "react";
import { Route, Switch } from "react-router";
import StoryRouter from "storybook-react-router";

function AppMenu() {
    return (
        <Menu>
            <MenuItemRouterLink text="Foo1" icon={<CalendarToday />} to="/foo1" />
            <MenuItemRouterLink text="Foo2" icon={<School />} to="/foo2" />
            <MenuCollapsibleItem text="Foo3" icon={<Settings />} collapsible={true} isOpen={false}>
                <MenuItemRouterLink text="Foo4" icon={<Home />} to="/foo4" />
                <MenuItemRouterLink text="Foo5" icon={<Home />} to="/foo5" />
            </MenuCollapsibleItem>
        </Menu>
    );
}

function Story() {
    return (
        <Master
            renderHeader={() => (
                <Typography variant="h5" color="primary">
                    Example
                </Typography>
            )}
            menuComponent={AppMenu}
        >
            <Switch>
                aaa
                <Route path="/foo1" render={() => <div>Foo 1</div>} />
                <Route path="/foo2" render={() => <div>Foo 2</div>} />
                <Route path="/foo4" render={() => <div>Foo 4</div>} />
                <Route path="/foo5" render={() => <div>Foo 5</div>} />
            </Switch>
        </Master>
    );
}

storiesOf("react-admin-mui", module)
    .addDecorator(StoryRouter())
    .add("Menu", () => <Story />);
