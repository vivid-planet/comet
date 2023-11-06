import { ComponentsOverrides, Tabs as MuiTabs, Theme } from "@mui/material";
import { WithStyles, withStyles } from "@mui/styles";
import * as React from "react";
import { Route, RouteComponentProps, withRouter } from "react-router-dom";

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

export interface Props extends RouteComponentProps {
    children: Array<React.ReactElement<RouterTabProps | DividerProps> | boolean | null | undefined>;
    tabComponent?: React.ComponentType<RouterTabProps>;
    tabsProps?: Partial<TabsProps>;
}

function RouterTabsComponent({
    children,
    tabsProps: {
        ScrollButtonComponent = TabScrollButton,
        tabComponent: TabComponent = CustomTab,
        dividerComponent: DividerComponent = CustomDivider,
        smallTabText,
        ...tabsProps
    } = {},
    history,
    match,
    classes,
}: Props & WithStyles<typeof styles>) {
    const stackApi = useStackApi();
    const stackSwitchApi = useStackSwitchApi();

    const childrenArr = React.Children.toArray(children);

    const handleChange = (event: React.SyntheticEvent, value: number) => {
        const paths = childrenArr.map((child) => {
            return React.isValidElement<RouterTabProps>(child) ? child.props.path : null;
        });
        history.push(deduplicateSlashesInUrl(match.url + paths[value]));
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
                <Route path={deduplicateSlashesInUrl(`${match.url}/:tab`)}>
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
                                        return <DividerComponent {...child.props} />;
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
                return React.isValidElement<RouterTabProps>(child) ? (
                    <Route path={deduplicateSlashesInUrl(`${match.url}/${child.props.path}`)}>
                        {({ match }) => {
                            if (match && stackApi && stackSwitchApi && !foundFirstMatch) {
                                foundFirstMatch = true;
                                return (
                                    <StackBreadcrumb
                                        url={deduplicateSlashesInUrl(`${match.url}/${child.props.path}`)}
                                        title={child.props.label}
                                        invisible={true}
                                    >
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
                ) : null;
            })}
        </div>
    );
}

export const RouterTabs = withRouter(withStyles(styles, { name: "CometAdminRouterTabs" })(RouterTabsComponent));

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
