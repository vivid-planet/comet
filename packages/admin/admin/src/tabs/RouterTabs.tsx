import { type ComponentsOverrides, Tab as MuiTab, type TabProps as MuiTabProps, Tabs, type TabsProps } from "@mui/material";
import { css, type Theme, useThemeProps } from "@mui/material/styles";
import { Children, type ComponentType, isValidElement, type ReactElement, type ReactNode, type SyntheticEvent, useContext } from "react";
import { matchPath, UNSAFE_RouteContext, useLocation, useNavigate } from "react-router";

import { createComponentSlot } from "../helpers/createComponentSlot";
import { type ThemedComponentBaseProps } from "../helpers/ThemedComponentBaseProps";
import { useSubRoutePrefix } from "../router/SubRoute";
import { useIsActiveStackSwitch } from "../stack/useIsActiveStackSwitch";
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
            display: none;
        `}
    `,
);

function deduplicateSlashesInUrl(url: string) {
    return url.replace(/\/+/g, "/");
}

interface TabProps extends Omit<MuiTabProps, "children"> {
    path: string;
    label: ReactNode;
    forceRender?: boolean;
    children: ReactNode;
}

export const RouterTab = (props: TabProps) => null;

type RouterTabsChild = ReactElement<TabProps> | boolean | null | undefined;
type RouterTabsChildren = RouterTabsChild | Array<RouterTabsChild | Array<RouterTabsChild>>;

interface Props
    extends ThemedComponentBaseProps<{
        root: "div";
        tabs: typeof Tabs;
        content: "div";
    }> {
    children: RouterTabsChildren;
    tabComponent?: ComponentType<MuiTabProps>;
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

    const navigate = useNavigate();
    const subRoutePrefix = useSubRoutePrefix();
    const location = useLocation();
    const routeContext = useContext(UNSAFE_RouteContext);
    const currentMatch = routeContext.matches[routeContext.matches.length - 1];
    const routeMatchPath = currentMatch?.route?.path ?? currentMatch?.pathnameBase ?? "";
    const isActiveStackSwitch = useIsActiveStackSwitch();

    const childrenArr = Children.toArray(children);

    const handleChange = (event: SyntheticEvent, value: number) => {
        const paths = childrenArr.map((child) => {
            return isValidElement<TabProps>(child) ? child.props.path : null;
        });
        navigate(deduplicateSlashesInUrl(subRoutePrefix + paths[value]));
    };

    const paths = childrenArr.map((child) => {
        // as seen in https://github.com/mui-org/material-ui/blob/v4.11.0/packages/material-ui/src/Tabs/Tabs.js#L390
        if (!isValidElement<TabProps>(child)) {
            return null;
        }

        if (child.type !== RouterTab) {
            throw new Error("RouterTabs must contain only Tab children");
        }
        return child.props.path;
    });

    const rearrangedChildren = Children.toArray(children);
    const defaultPathIndex = paths.indexOf("");

    if (defaultPathIndex >= 0) {
        const defaultPathChild = rearrangedChildren[defaultPathIndex];

        rearrangedChildren.splice(defaultPathIndex, 1);
        rearrangedChildren.push(defaultPathChild);
    }

    // used for only rendering the first matching child
    // note: React Router's Switch can't be used because it
    // prevents the rendering of more than one child
    // however we need to render all children if forceRender is true
    let foundFirstMatch = false;

    return (
        <Root {...slotProps?.root} {...restProps}>
            {/* When inside a Stack show only the last TabBar */}
            {isActiveStackSwitch &&
                (() => {
                    const tabMatch = matchPath({ path: deduplicateSlashesInUrl(`${subRoutePrefix}/:tab`), end: false }, location.pathname);
                    const routePath = tabMatch ? `/${(tabMatch.params as Record<string, string>).tab}` : "";
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
                            {Children.map(children, (child) => {
                                if (!isValidElement<TabProps>(child)) {
                                    return null;
                                }
                                const { path, forceRender, children, label, ...restTabProps } = child.props;
                                return <TabComponent label={label} {...restTabProps} />;
                            })}
                        </StyledTabs>
                    );
                })()}
            {Children.map(rearrangedChildren, (child) => {
                if (!isValidElement<TabProps>(child)) {
                    return null;
                }
                const path = child.props.path != "" ? deduplicateSlashesInUrl(`${subRoutePrefix}/${child.props.path}`) : routeMatchPath;
                const tabMatch = matchPath({ path, end: false }, location.pathname);
                if (tabMatch && !foundFirstMatch) {
                    foundFirstMatch = true;
                    return (
                        <Content ownerState={{ contentHidden: false }} {...slotProps?.content}>
                            {child.props.children}
                        </Content>
                    );
                } else if (child.props.forceRender) {
                    return (
                        <Content ownerState={{ contentHidden: true }} {...slotProps?.content}>
                            {child.props.children}
                        </Content>
                    );
                } else {
                    // don't render tab contents
                    return null;
                }
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
