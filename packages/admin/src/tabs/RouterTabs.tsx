import MuiTab, { TabProps as MuiTabProps } from "@mui/material/Tab";
import Tabs, { TabsProps } from "@mui/material/Tabs";
import { WithStyles, withStyles } from "@mui/styles";
import * as React from "react";
import { Route, RouteComponentProps, Switch, withRouter } from "react-router-dom";

import { StackApiContext } from "../stack/Api";
import { StackBreadcrumb } from "../stack/Breadcrumb";
import { StackSwitchApiContext } from "../stack/Switch";
import { RouterTabsClassKey, styles } from "./RouterTabs.styles";

// TODO: Fix this
// @ts-ignore
interface TabProps extends MuiTabProps {
    path: string;
    label: React.ReactNode;
    forceRender?: boolean;
    children: React.ReactNode;
}
export const RouterTab: React.SFC<TabProps> = () => null;

export interface Props extends RouteComponentProps {
    children: Array<React.ReactElement<TabProps> | boolean | null | undefined> | React.ReactElement<TabProps>;
    tabComponent?: React.ComponentType<MuiTabProps>;
    tabsProps?: Partial<TabsProps>;
}

function RouterTabsComponent({
    children,
    tabComponent: TabComponent = MuiTab,
    tabsProps,
    history,
    match,
    classes,
}: Props & WithStyles<typeof styles>) {
    const childrenArr = React.Children.toArray(children);

    const handleChange = (event: {}, value: number) => {
        const paths = childrenArr.map((child) => {
            return React.isValidElement<TabProps>(child) ? child.props.path : null;
        });
        history.push(match.url + paths[value]);
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

    return (
        <div className={classes.root}>
            <StackApiContext.Consumer>
                {(stackApi) => (
                    <StackSwitchApiContext.Consumer>
                        {(stackSwitchApi) => {
                            const ret = (
                                <Route path={`${match.url}/:tab`}>
                                    {({ match }) => {
                                        const routePath = match ? `/${match.params.tab}` : "";
                                        const value = paths.includes(routePath) ? paths.indexOf(routePath) : defaultPathIndex;
                                        return (
                                            <Tabs classes={{ root: classes.tabs }} value={value} onChange={handleChange} {...tabsProps}>
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
                            );

                            if (stackApi && stackSwitchApi) {
                                // When inside a Stack show only the last TabBar
                                const ownSwitchIndex = stackSwitchApi.id ? stackApi.switches.findIndex((i) => i.id === stackSwitchApi.id) : -1;
                                const nextSwitchShowsInitialPage =
                                    stackApi.switches[ownSwitchIndex + 1] && stackApi.switches[ownSwitchIndex + 1].isInitialPageActive;
                                const shouldShowTabBar = ownSwitchIndex === stackApi.switches.length - (nextSwitchShowsInitialPage ? 2 : 1);
                                if (!shouldShowTabBar) {
                                    return null;
                                }
                            }
                            return ret;
                        }}
                    </StackSwitchApiContext.Consumer>
                )}
            </StackApiContext.Consumer>
            <Switch>
                {React.Children.map(rearrangedChildren, (child) => {
                    return React.isValidElement<TabProps>(child) ? (
                        <Route path={`${match.url}${child.props.path}`}>
                            {({ match }) => {
                                if (!match && !child.props.forceRender) {
                                    return null;
                                }
                                if (match) {
                                    return (
                                        <StackBreadcrumb url={`${match.url}${child.props.path}`} title={child.props.label} invisible={true}>
                                            <div className={classes.content}>{child.props.children}</div>
                                        </StackBreadcrumb>
                                    );
                                } else {
                                    return <div className={`${classes.content} ${classes.contentHidden}`}>{child.props.children}</div>;
                                }
                            }}
                        </Route>
                    ) : null;
                })}
            </Switch>
        </div>
    );
}

export const RouterTabs = withRouter(withStyles(styles, { name: "CometAdminRouterTabs" })(RouterTabsComponent));

declare module "@mui/material/styles/overrides" {
    interface ComponentNameToClassKey {
        CometAdminRouterTabs: RouterTabsClassKey;
    }
}
