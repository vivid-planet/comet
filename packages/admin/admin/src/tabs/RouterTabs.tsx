import { ComponentsOverrides, Tab as MuiTab, TabProps as MuiTabProps, Tabs, TabsProps } from "@mui/material";
import { css, Theme, useThemeProps } from "@mui/material/styles";
import * as React from "react";
import { Route, useHistory, useRouteMatch } from "react-router-dom";

import { createComponentSlot } from "../helpers/createComponentSlot";
import { ThemedComponentBaseProps } from "../helpers/ThemedComponentBaseProps";
import { useSubRoutePrefix } from "../router/SubRoute";
import { useStackApi } from "../stack/Api";
import { StackBreadcrumb } from "../stack/Breadcrumb";
import { useStackSwitchApi } from "../stack/Switch";
import { TabScrollButton } from "./TabScrollButton";

export type RouterTabsClassKey = "root" | "tabs" | "content" | "contentHidden";

type OwnerState = { contentHidden?: boolean };

const Root = createComponentSlot("div")<RouterTabsClassKey>({
    componentName: "RouterTabs",
    slotName: "root",
})();

const StyledTabs = createComponentSlot(Tabs)<RouterTabsClassKey>({
    componentName: "RouterTabs",
    slotName: "tabs",
})();

const Content = createComponentSlot("div")<RouterTabsClassKey, OwnerState>({
    componentName: "RouterTabs",
    slotName: "content",
    classesResolver(ownerState) {
        return [ownerState.contentHidden && "contentHidden"];
    },
})(
    ({ ownerState }) => css`
        ${ownerState.contentHidden &&
        css`
            display: "none";
        `}
    `,
);

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

type RouterTabsChild = React.ReactElement<TabProps> | boolean | null | undefined;
type RouterTabsChildren = RouterTabsChild | Array<RouterTabsChild | Array<RouterTabsChild>>;

export interface Props
    extends ThemedComponentBaseProps<{
        root: "div";
        tabs: typeof Tabs;
        content: "div";
    }> {
    children: RouterTabsChildren;
    tabComponent?: React.ComponentType<MuiTabProps>;
    tabsProps?: Partial<TabsProps>;
}

export function RouterTabs(inProps: Props) {
    const {
        children,
        tabComponent: TabComponent = MuiTab,
        tabsProps: { ScrollButtonComponent = TabScrollButton, ...tabsProps } = {},
        slotProps,
        ...restProps
    } = useThemeProps({ props: inProps, name: "CometAdminRouterTabs" });

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
        <Root {...slotProps?.root} {...restProps}>
            {shouldShowTabBar && (
                <Route path={deduplicateSlashesInUrl(`${subRoutePrefix}/:tab`)}>
                    {({ match }) => {
                        const routePath = match ? `/${match.params.tab}` : "";
                        const value = paths.includes(routePath) ? paths.indexOf(routePath) : defaultPathIndex;
                        return (
                            <StyledTabs
                                value={value}
                                onChange={handleChange}
                                ScrollButtonComponent={ScrollButtonComponent}
                                scrollButtons="auto"
                                variant="scrollable"
                                {...slotProps?.tabs}
                                {...tabsProps}
                            >
                                {React.Children.map(children, (child) => {
                                    if (!React.isValidElement<TabProps>(child)) {
                                        return null;
                                    }
                                    const { path, forceRender, children, label, ...restTabProps } = child.props;
                                    return <TabComponent label={label} {...restTabProps} />;
                                })}
                            </StyledTabs>
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
                            const ownerState: OwnerState = {
                                contentHidden: !(match && !foundFirstMatch) && child.props.forceRender,
                            };
                            let ret = null;
                            if ((match && !foundFirstMatch) || child.props.forceRender) {
                                foundFirstMatch = true;
                                ret = (
                                    <Content ownerState={ownerState} {...slotProps?.content}>
                                        {child.props.children}
                                    </Content>
                                );
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
        </Root>
    );
}

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
