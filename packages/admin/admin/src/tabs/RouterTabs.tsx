import { ComponentsOverrides, Tab as MuiTab, TabProps as MuiTabProps, Tabs, TabsProps, Theme } from "@mui/material";
import { WithStyles, withStyles } from "@mui/styles";
import * as React from "react";
import { Route, useHistory, useRouteMatch } from "react-router-dom";

import { useSubRoutePrefix } from "../router/SubRoute";
import { useStackApi } from "../stack/Api";
import { StackBreadcrumb } from "../stack/Breadcrumb";
import { useStackSwitchApi } from "../stack/Switch";
import { RouterTabsClassKey, styles } from "./RouterTabs.styles";
import { TabScrollButton } from "./TabScrollButton";

function deduplicateSlashesInUrl(url: string) {
    return url.replace(/\/+/g, "/");
}

interface TabProps extends Omit<MuiTabProps, "children"> {
    path: string;
    label: React.ReactNode;
    forceRender?: boolean;
    children: React.ReactNode;
}

export const RouterTab: React.FunctionComponent<TabProps> = () => null;

export interface Props {
    children: Array<React.ReactElement<TabProps> | boolean | null | undefined> | React.ReactElement<TabProps>;
    tabComponent?: React.ComponentType<MuiTabProps>;
    tabsProps?: Partial<TabsProps>;
}

<<<<<<< HEAD
function RouterTabsComponent({ children, tabComponent: TabComponent = MuiTab, tabsProps, classes }: Props & WithStyles<typeof styles>) {
=======
function RouterTabsComponent({
    children,
    tabComponent: TabComponent = MuiTab,
    tabsProps: { ScrollButtonComponent = TabScrollButton, ...tabsProps } = {},
    history,
    match,
    classes,
}: Props & WithStyles<typeof styles>) {
>>>>>>> main
    const stackApi = useStackApi();
    const stackSwitchApi = useStackSwitchApi();
    const history = useHistory();
    const subRoutePrefix = useSubRoutePrefix();
    const routeMatch = useRouteMatch();

    const childrenArr = React.Children.toArray(children);

    const handleChange = (event: React.SyntheticEvent, value: number) => {
        const paths = childrenArr.map((child) => {
            return React.isValidElement<TabProps>(child) ? child.props.path : null;
        });
        history.push(deduplicateSlashesInUrl(subRoutePrefix + paths[value]));
    };

    const paths = childrenArr.map((child) => {
        // as seen in https://github.com/mui-org/material-ui/blob/v4.11.0/packages/material-ui/src/Tabs/Tabs.js#L390
        if (!React.isValidElement<TabProps>(child)) {
            return null;
        }

        if (child.type !== RouterTab) {
            throw new Error("RouterTabs must contain only Tab children");
        }
        return child.props.path;
    });

    const rearrangedChildren = React.Children.toArray(children);
    const defaultPathIndex = paths.indexOf("");

    if (defaultPathIndex >= 0) {
        const defaultPathChild = rearrangedChildren[defaultPathIndex];

        rearrangedChildren.splice(defaultPathIndex, 1);
        rearrangedChildren.push(defaultPathChild);
    }

    let shouldShowTabBar = true;
    if (stackApi && stackSwitchApi) {
        // When inside a Stack show only the last TabBar
        const ownSwitchIndex = stackSwitchApi.id ? stackApi.switches.findIndex((i) => i.id === stackSwitchApi.id) : -1;
        const nextSwitchShowsInitialPage = stackApi.switches[ownSwitchIndex + 1] && stackApi.switches[ownSwitchIndex + 1].isInitialPageActive;

        shouldShowTabBar = ownSwitchIndex === stackApi.switches.length - (nextSwitchShowsInitialPage ? 2 : 1);
    }

    // used for only rendering the first matching child
    // note: React Router's Switch can't be used because it
    // prevents the rendering of more than one child
    // however we need to render all children if forceRender is true
    let foundFirstMatch = false;

    return (
        <div className={classes.root}>
            {shouldShowTabBar && (
                <Route path={deduplicateSlashesInUrl(`${subRoutePrefix}/:tab`)}>
                    {({ match }) => {
                        const routePath = match ? `/${match.params.tab}` : "";
                        const value = paths.includes(routePath) ? paths.indexOf(routePath) : defaultPathIndex;
                        return (
                            <Tabs
                                classes={{ root: classes.tabs }}
                                value={value}
                                onChange={handleChange}
                                ScrollButtonComponent={ScrollButtonComponent}
                                scrollButtons="auto"
                                variant="scrollable"
                                {...tabsProps}
                            >
                                {React.Children.map(children, (child) => {
                                    if (!React.isValidElement<TabProps>(child)) {
                                        return null;
                                    }
                                    const { path, forceRender, children, label, ...restTabProps } = child.props;
                                    return <TabComponent label={label} {...restTabProps} />;
                                })}
                            </Tabs>
                        );
                    }}
                </Route>
            )}
            {React.Children.map(rearrangedChildren, (child) => {
                if (!React.isValidElement<TabProps>(child)) {
                    return null;
                }
                const path = child.props.path != "" ? deduplicateSlashesInUrl(`${subRoutePrefix}/${child.props.path}`) : routeMatch.path;
                return (
                    <Route path={path}>
                        {({ match }) => {
                            if (match && stackApi && stackSwitchApi && !foundFirstMatch) {
                                foundFirstMatch = true;
                                return (
                                    <StackBreadcrumb url={path} title={child.props.label} invisible={true}>
                                        <div className={classes.content}>{child.props.children}</div>
                                    </StackBreadcrumb>
                                );
                            } else if (match && !foundFirstMatch) {
                                foundFirstMatch = true;
                                return <div className={classes.content}>{child.props.children}</div>;
                            } else if (child.props.forceRender) {
                                return <div className={`${classes.content} ${classes.contentHidden}`}>{child.props.children}</div>;
                            } else {
                                return null;
                            }
                        }}
                    </Route>
                );
            })}
        </div>
    );
}

export const RouterTabs = withStyles(styles, { name: "CometAdminRouterTabs" })(RouterTabsComponent);

declare module "@mui/material/styles" {
    interface ComponentNameToClassKey {
        CometAdminRouterTabs: RouterTabsClassKey;
    }

    interface Components {
        CometAdminRouterTabs?: {
            styleOverrides?: ComponentsOverrides<Theme>["CometAdminRouterTabs"];
        };
    }
}
