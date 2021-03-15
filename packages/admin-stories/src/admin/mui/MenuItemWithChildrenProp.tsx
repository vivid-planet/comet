import { MasterLayout, Menu, MenuCollapsibleItem, MenuItemRouterLink } from "@comet/admin";
import { Typography } from "@material-ui/core";
import { CalendarToday, Home, School, Settings } from "@material-ui/icons";
import { storiesOf } from "@storybook/react";
import * as React from "react";
import { FormattedMessage } from "react-intl";
import { Route, Switch } from "react-router";
import StoryRouter from "storybook-react-router";

const AppMenu: React.FC = () => (
    <Menu>
        <MenuItemRouterLink  icon={<CalendarToday />} to="/foo1" >
            <FormattedMessage id="comet.stories.foo1" defaultMessage="Foo1"/>
        </MenuItemRouterLink>
        <MenuItemRouterLink icon={<School />} to="/foo2" >
            <FormattedMessage id="comet.stories.foo2" defaultMessage="Foo2"/>
        </MenuItemRouterLink>
        <MenuCollapsibleItem text={<FormattedMessage id="comet.stories.foo3" defaultMessage="Foo3"/>} icon={<Settings />} collapsible={true} isOpen={false}>
            <MenuItemRouterLink icon={<Home />} to="/foo4" >
                <FormattedMessage id="comet.stories.foo4" defaultMessage="Foo4"/>
            </MenuItemRouterLink>
            <MenuItemRouterLink text="Foo5" icon={<Home />} to="/foo5" >
                <FormattedMessage id="comet.stories.foo5" defaultMessage="Foo5"/>
            </MenuItemRouterLink>
        </MenuCollapsibleItem>
    </Menu>
);

const AppHeader: React.FC = () => (
    <Typography variant="h5" color="primary">
        Example
    </Typography>
);

const Story: React.FC = () => (
    <MasterLayout headerComponent={AppHeader} menuComponent={AppMenu}>
        <Switch>
            <Route path="/foo1" render={() => <div>Foo 1</div>} />
            <Route path="/foo2" render={() => <div>Foo 2</div>} />
            <Route path="/foo4" render={() => <div>Foo 4</div>} />
            <Route path="/foo5" render={() => <div>Foo 5</div>} />
        </Switch>
    </MasterLayout>
);

storiesOf("@comet/admin/mui", module)
    .addDecorator(StoryRouter())
    .add("MenuItem with children prop", () => <Story />);
