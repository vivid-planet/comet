import { ComponentsOverrides, Tabs as MuiTabs, Theme } from "@mui/material";
import { WithStyles, withStyles } from "@mui/styles";
import * as React from "react";
import { Route, RouteComponentProps, useHistory, useRouteMatch } from "react-router-dom";

import { useSubRoutePrefix } from "../router/SubRoute";
import { useStackApi } from "../stack/Api";
import { StackBreadcrumb } from "../stack/Breadcrumb";
import { useStackSwitchApi } from "../stack/Switch";
import { CustomDivider, Divider, DividerProps } from "./CustomDivider";
import { CustomTab, TabProps } from "./CustomTab";
import { RouterTabsClassKey, styles } from "./RouterTabs.styles";
import { TabsProps } from "./Tabs";
import { TabScrollButton } from "./TabScrollButton";

function deduplicateSlashesInUrl(url: string) {
    return url.replace(/\/+/g, "/");
}

interface RouterTabProps extends TabProps {
    path: string;
}

export const RouterTab: React.FC<Omit<RouterTabProps, "currentTab">> = () => null;

export interface RouterTabsProps extends Partial<RouteComponentProps> {
    children: Array<React.ReactElement<RouterTabProps | DividerProps> | boolean | null | undefined> | React.ReactElement<RouterTabProps>;
    tabComponent?: React.ComponentType<RouterTabProps>;
    tabsProps?: Partial<TabsProps>;
}

function RouterTabsComponent({
    children,
    tabsProps: { ScrollButtonComponent = TabScrollButton, tabComponent: TabComponent = CustomTab, smallTabText, ...tabsProps } = {},
    classes,
}: RouterTabsProps & WithStyles<typeof styles>) {
    const stackApi = useStackApi();
    const stackSwitchApi = useStackSwitchApi();
    const history = useHistory();
    const subRoutePrefix = useSubRoutePrefix();
    const routeMatch = useRouteMatch();

    const childrenArr = React.Children.toArray(children);

    const handleChange = (event: React.SyntheticEvent, value: number) => {
        const paths = childrenArr.map((child) => {
            return React.isValidElement<RouterTabProps>(child) ? child.props.path : null;
        });
        history.push(deduplicateSlashesInUrl(subRoutePrefix + paths[value]));
    };

    const paths = childrenArr.map((child) => {
        // as seen in https://github.com/mui-org/material-ui/blob/v4.11.0/packages/material-ui/src/Tabs/Tabs.js#L390
        if (!React.isValidElement<RouterTabProps>(child)) {
            return null;
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
                            <MuiTabs
                                classes={{ root: classes.tabs }}
                                value={value}
                                onChange={handleChange}
                                ScrollButtonComponent={ScrollButtonComponent}
                                scrollButtons="auto"
                                variant="scrollable"
                                {...tabsProps}
                            >
                                {React.Children.map(children, (child: React.ReactElement<RouterTabProps | DividerProps>) => {
                                    if (React.isValidElement<RouterTabProps>(child) && child.type === RouterTab) {
                                        const { path, forceRender, children, ...restChildProps } = child.props;
                                        return <TabComponent {...(restChildProps as TabProps)} smallTabText={smallTabText} currentTab={value} />;
                                    } else if (React.isValidElement<DividerProps>(child) && child.type === Divider) {
                                        return <CustomDivider {...child.props} />;
                                    } else {
                                        if (!React.isValidElement<RouterTabProps>(child) && !React.isValidElement<DividerProps>(child)) {
                                            return null;
                                        }

                                        if (child.type !== RouterTab || child.type !== Divider) {
                                            throw new Error(
                                                `RouterTabs may only contain router tab or divider components as children. Found ${child.type} component/ tag.`,
                                            );
                                        }
                                    }
                                })}
                            </MuiTabs>
                        );
                    }}
                </Route>
            )}
            {React.Children.map(rearrangedChildren, (child) => {
                if (!React.isValidElement<RouterTabProps>(child)) {
                    return null;
                }
                const path = child.props.path != "" ? deduplicateSlashesInUrl(`${subRoutePrefix}/${child.props.path}`) : routeMatch.path;
                return (
                    <Route path={path}>
                        {({ match }) => {
                            let ret = null;
                            if (match && !foundFirstMatch) {
                                foundFirstMatch = true;
                                ret = <div className={classes.content}>{child.props.children}</div>;
                            } else if (child.props.forceRender) {
                                ret = <div className={`${classes.content} ${classes.contentHidden}`}>{child.props.children}</div>;
                            } else {
                                // don't render tab contents, return early as we don't need StackBreadcrumb either
                                return null;
                            }
                            if (stackApi && stackSwitchApi) {
                                return (
                                    <StackBreadcrumb url={path} title={child.props.label} invisible={true}>
                                        {ret}
                                    </StackBreadcrumb>
                                );
                            } else {
                                return ret;
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
