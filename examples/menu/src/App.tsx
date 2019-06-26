import { Typography } from "@material-ui/core";
import { CalendarToday, Home, School, Settings } from "@material-ui/icons";
import { Master, Menu, MenuCollapsibleItem, MenuItemLink } from "@vivid-planet/react-admin-mui";
import * as React from "react";
import { Route, Switch } from "react-router";

function AppMenu() {
    return (
        <Menu>
            <MenuItemLink text="Foo1" icon={<CalendarToday />} path="/foo1" />
            <MenuItemLink text="Foo2" icon={<School />} path="/foo2" />
            <MenuCollapsibleItem text="Foo3" icon={<Settings />} collapsible={true} isOpen={false}>
                <MenuItemLink text="Foo4" icon={<Home />} path="/foo4" />
                <MenuItemLink text="Foo5" icon={<Home />} path="/foo5" />
            </MenuCollapsibleItem>
        </Menu>
    );
}

export default function App() {
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
