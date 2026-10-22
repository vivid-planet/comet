import { Tab as UiTab, TabList, type TabListProps, type TabProps as UiTabProps, Tabs, type TabsProps } from "@dextinity/ui";
import { css, styled } from "@mui/material/styles";
import { Children, type ComponentProps, isValidElement, type ReactElement, type ReactNode } from "react";
import { Route, useHistory, useRouteMatch } from "react-router-dom";

import { useSubRoutePrefix } from "../router/SubRoute";
import { useIsActiveStackSwitch } from "../stack/useIsActiveStackSwitch";
import { tabListLabel } from "./Tabs";

export type RouterTabsClassKey = "root" | "tabs" | "content" | "contentHidden";

const Content = styled("div")(css`
    &[hidden] {
        display: none;
    }
`);

function deduplicateSlashesInUrl(url: string) {
    return url.replace(/\/+/g, "/");
}

interface TabProps {
    path: string;
    label: ReactNode;
    /** Keeps the content rendered while another tab is selected, for example to keep a form's entries. */
    forceRender?: boolean;
    disabled?: boolean;
    icon?: ReactNode;
    children: ReactNode;
}

export const RouterTab = (props: TabProps) => null;

type RouterTabsChild = ReactElement<TabProps> | boolean | null | undefined;
type RouterTabsChildren = RouterTabsChild | Array<RouterTabsChild | Array<RouterTabsChild>>;

interface Props {
    children: RouterTabsChildren;
    /** The accessible name of the tab list, for example "Product". */
    label?: string;
    className?: string;
    tabsProps?: Partial<TabsProps>;
    slotProps?: {
        root?: Partial<ComponentProps<"div">>;
        tabs?: Partial<TabListProps>;
        tab?: Partial<UiTabProps>;
        content?: Partial<ComponentProps<"div">>;
    };
}

export function RouterTabs({ children, label, className, tabsProps, slotProps }: Props) {
    const history = useHistory();
    const subRoutePrefix = useSubRoutePrefix();
    const routeMatch = useRouteMatch();
    const isActiveStackSwitch = useIsActiveStackSwitch();

    const childrenArr = Children.toArray(children);

    const handleChange = (value: number) => {
        const paths = childrenArr.map((child) => {
            return isValidElement<TabProps>(child) ? child.props.path : null;
        });
        history.push(deduplicateSlashesInUrl(subRoutePrefix + paths[value]));
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
        <div className={className} {...slotProps?.root}>
            {/* When inside a Stack show only the last TabBar */}
            {isActiveStackSwitch && (
                <Route path={deduplicateSlashesInUrl(`${subRoutePrefix}/:tab`)}>
                    {({ match }) => {
                        const routePath = match ? `/${match.params.tab}` : "";
                        const value = paths.includes(routePath) ? paths.indexOf(routePath) : defaultPathIndex;
                        return (
                            <Tabs
                                value={value}
                                onValueChange={(newValue, eventDetails) => {
                                    // The tabs also report a tab they select themselves, which must not change the URL.
                                    if (eventDetails.reason === "none") {
                                        handleChange(newValue as number);
                                    }
                                }}
                                {...tabsProps}
                            >
                                <TabList {...tabListLabel(label)} {...slotProps?.tabs}>
                                    {childrenArr.map((child, index) => {
                                        if (!isValidElement<TabProps>(child)) {
                                            return null;
                                        }
                                        return (
                                            <UiTab
                                                key={child.key}
                                                value={index}
                                                icon={child.props.icon}
                                                disabled={child.props.disabled}
                                                {...slotProps?.tab}
                                            >
                                                {child.props.label}
                                            </UiTab>
                                        );
                                    })}
                                </TabList>
                            </Tabs>
                        );
                    }}
                </Route>
            )}
            {Children.map(rearrangedChildren, (child) => {
                if (!isValidElement<TabProps>(child)) {
                    return null;
                }
                const path = child.props.path != "" ? deduplicateSlashesInUrl(`${subRoutePrefix}/${child.props.path}`) : routeMatch.path;
                return (
                    <Route path={path}>
                        {({ match }) => {
                            if (match && !foundFirstMatch) {
                                foundFirstMatch = true;
                                return <Content {...slotProps?.content}>{child.props.children}</Content>;
                            } else if (child.props.forceRender) {
                                return (
                                    <Content hidden {...slotProps?.content}>
                                        {child.props.children}
                                    </Content>
                                );
                            } else {
                                // don't render tab contents
                                return null;
                            }
                        }}
                    </Route>
                );
            })}
        </div>
    );
}
