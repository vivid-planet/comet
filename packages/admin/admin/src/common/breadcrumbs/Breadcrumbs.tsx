import { ChevronRight } from "@comet/admin-icons";
import { type ComponentsOverrides, Typography } from "@mui/material";
import { css, type Theme, useThemeProps } from "@mui/material/styles";
import { Fragment, type ReactNode } from "react";

import { createComponentSlot } from "../../helpers/createComponentSlot";
import { type ThemedComponentBaseProps } from "../../helpers/ThemedComponentBaseProps";

type BreadcrumbsClassKey = "root" | "breadcrumbsItem" | "separator";

export interface Breadcrumb {
    url: string;
    title: ReactNode;
}

interface BreadcrumbsProps
    extends ThemedComponentBaseProps<{
        root: "div";
        breadcrumbsItem: typeof Typography;
        separator: typeof ChevronRight;
    }> {
    items: Breadcrumb[];
}

const Root = createComponentSlot("div")<BreadcrumbsClassKey>({
    componentName: "Breadcrumbs",
    slotName: "root",
})(
    ({ theme }) => css`
        display: flex;
        align-items: center;
        height: 50px;
        padding: 0 ${theme.spacing(2)};
    `,
);

const BreadcrumbsItem = createComponentSlot(Typography)<BreadcrumbsClassKey>({
    componentName: "Breadcrumbs",
    slotName: "breadcrumbsItem",
})(
    ({ theme }) => css`
        color: ${theme.palette.grey[900]};
        white-space: nowrap;

        &:not(:last-child):hover {
            color: ${theme.palette.primary.main};
        }

        &:last-child {
            font-weight: bold;
            overflow: hidden;
            text-overflow: ellipsis;
        }
    `,
) as typeof Typography;

const Separator = createComponentSlot(ChevronRight)<BreadcrumbsClassKey>({
    componentName: "Breadcrumbs",
    slotName: "separator",
})(css`
    margin: 0 5px;
`);

export const Breadcrumbs = (inProps: BreadcrumbsProps) => {
    const { items, slotProps, ...restProps } = useThemeProps({ props: inProps, name: "CometAdminBreadcrumbs" });
    return (
        <Root {...slotProps?.root} {...restProps}>
            {items.map((item, index) => {
                const isCurrentPage = index === items.length - 1;

                if (isCurrentPage) {
                    return (
                        <BreadcrumbsItem key={item.url} {...slotProps?.breadcrumbsItem}>
                            {item.title}
                        </BreadcrumbsItem>
                    );
                }

                return (
                    <Fragment key={item.url}>
                        {/* @ts-expect-error The component prop does not work properly with MUIs `styled()`, see: https://mui.com/material-ui/guides/typescript/#complications-with-the-component-prop */}
                        <BreadcrumbsItem component="a" href={item.url} {...slotProps?.breadcrumbsItem}>
                            {item.title}
                        </BreadcrumbsItem>
                        <Separator {...slotProps?.separator} />
                    </Fragment>
                );
            })}
        </Root>
    );
};

declare module "@mui/material/styles" {
    interface ComponentsPropsList {
        CometAdminBreadcrumbs: BreadcrumbsProps;
    }

    interface ComponentNameToClassKey {
        CometAdminBreadcrumbs: BreadcrumbsClassKey;
    }

    interface Components {
        CometAdminBreadcrumbs?: {
            defaultProps?: Partial<ComponentsPropsList["CometAdminBreadcrumbs"]>;
            styleOverrides?: ComponentsOverrides<Theme>["CometAdminBreadcrumbs"];
        };
    }
}
