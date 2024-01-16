import { ChevronRight } from "@comet/admin-icons";
import { ComponentsOverrides, css, styled, Theme, useTheme, useThemeProps } from "@mui/material/styles";
import { ThemedComponentBaseProps } from "helpers/ThemedComponentBaseProps";
import * as React from "react";

import { useStackApi } from "../Api";
import { getElementOuterWidth, useItemsToRender, useObservedWidth } from "./utils";

export type StackBreadcrumbsClassKey = "root" | "breadcrumbs" | "listItem" | "separator";

const Root = styled("div", {
    name: "CometAdminStackBreadcrumbs",
    slot: "root",
    overridesResolver(_, styles) {
        return [styles.root];
    },
})(
    css`
        position: relative;
    `,
);

const Breadcrumbs = styled("div", {
    name: "CometAdminStackBreadcrumbs",
    slot: "breadcrumbs",
    overridesResolver(_, styles) {
        return [styles.breadcrumbs];
    },
})(
    ({ theme }) => css`
        display: flex;
        height: 50px;
        border-bottom: 1px solid ${theme.palette.divider};
        box-sizing: border-box;
        flex-wrap: nowrap;
        overflow-x: auto; // Make the breadcrumbs scrollable, if they still take up too much space, when only the first, last & the overflow link are visible.
    `,
);

const ListItem = styled("div", {
    name: "CometAdminStackBreadcrumbs",
    slot: "listItem",
    overridesResolver(_, styles) {
        return [styles.listItem];
    },
})(
    css`
        display: flex;
        align-items: center;
        flex-shrink: 0;
        white-space: nowrap;
    `,
);

const Separator = styled("div", {
    name: "CometAdminStackBreadcrumbs",
    slot: "separator",
    overridesResolver(_, styles) {
        return [styles.separator];
    },
})(
    css`
        font-size: 12px;
        line-height: 0;
        margin-left: 8px;
        margin-right: 8px;
    `,
);

export interface StackBreadcrumbsProps extends ThemedComponentBaseProps<{ root: "div"; breadcrumbs: "div"; listItem: "div"; separator: "div" }> {
    separator?: React.ReactNode;
    overflowLinkText?: React.ReactNode;
}

export function StackBreadcrumbs(inProps: StackBreadcrumbsProps) {
    const { separator, overflowLinkText = ". . .", slotProps, ...restProps } = useThemeProps({ props: inProps, name: "CometAdminStackBreadcrumbs" });
    const stackApi = useStackApi();
    const { palette } = useTheme();
    const breadcrumbsRef = React.useRef<HTMLDivElement>(null);
    const containerWidth = useObservedWidth(breadcrumbsRef);
    const [itemWidths, setItemWidths] = React.useState<number[] | undefined>();

    const breadcrumbItems = React.useMemo(() => stackApi?.breadCrumbs ?? [], [stackApi]);
    const combinedTitlesOfBreadcrumbs = breadcrumbItems.map(({ title }) => title).join("");

    React.useEffect(() => {
        setItemWidths(undefined);
    }, [breadcrumbItems?.length, combinedTitlesOfBreadcrumbs]);

    React.useEffect(() => {
        if (breadcrumbItems?.length && !itemWidths?.length) {
            const listItems = breadcrumbsRef.current?.children;
            const newItemWidths = listItems ? Object.values(listItems).map((listItem) => getElementOuterWidth(listItem)) : [];
            setItemWidths(newItemWidths);
        }
    }, [breadcrumbItems?.length, combinedTitlesOfBreadcrumbs, itemWidths]);

    const backButtonUrl = breadcrumbItems.length > 1 ? breadcrumbItems[breadcrumbItems.length - 2].url : undefined;
    const itemsToRender = useItemsToRender(breadcrumbItems, containerWidth ?? 0, itemWidths, overflowLinkText, backButtonUrl);

    if (!breadcrumbItems) return null;

    return (
        <Root {...slotProps?.root} {...restProps}>
            <Breadcrumbs {...slotProps?.breadcrumbs} ref={breadcrumbsRef}>
                {itemsToRender.map((item, index) => (
                    <ListItem {...slotProps?.listItem} key={index}>
                        {item}
                        {index < itemsToRender.length - 1 && (
                            <Separator {...slotProps?.separator}>
                                {separator ?? <ChevronRight fontSize="inherit" htmlColor={palette.grey[300]} />}
                            </Separator>
                        )}
                    </ListItem>
                ))}
            </Breadcrumbs>
        </Root>
    );
}

declare module "@mui/material/styles" {
    interface ComponentNameToClassKey {
        CometAdminStackBreadcrumbs: StackBreadcrumbsClassKey;
    }

    interface ComponentsPropsList {
        CometAdminStackBreadcrumbs: Partial<StackBreadcrumbsProps>;
    }

    interface Components {
        CometAdminStackBreadcrumbs?: {
            defaultProps?: ComponentsPropsList["CometAdminStackBreadcrumbs"];
            styleOverrides?: ComponentsOverrides<Theme>["CometAdminStackBreadcrumbs"];
        };
    }
}
