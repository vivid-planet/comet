import { Link, Typography as MuiTypography, TypographyTypeMap } from "@mui/material";
import { css, useThemeProps } from "@mui/material/styles";
import { forwardRef, Fragment } from "react";
import { Link as RouterLink, LinkProps as RouterLinkProps } from "react-router-dom";

import { createComponentSlot } from "../../../helpers/createComponentSlot";
import { ThemedComponentBaseProps } from "../../../helpers/ThemedComponentBaseProps";
import { StackApiContext } from "../../../stack/Api";

export type ToolbarBreadcrumbsClassKey = "item" | "typographyRoot" | "typographyActiveRoot" | "separatorContainer" | "separator";

type OwnerState = {
    active: boolean;
};

const Item = createComponentSlot("div")<ToolbarBreadcrumbsClassKey>({
    componentName: "ToolbarBreadcrumbs",
    slotName: "item",
})(css`
    display: flex;
    align-items: center;
    padding: 15px;
`);

const TypographyRoot = createComponentSlot(MuiTypography)<ToolbarBreadcrumbsClassKey, OwnerState>({
    componentName: "ToolbarBreadcrumbs",
    slotName: "typographyRoot",
    classesResolver(ownerState) {
        return [ownerState.active && "typographyActiveRoot"];
    },
})(
    ({ ownerState }) => css`
        font-size: 14px;
        font-weight: 200;
        line-height: 16px;

        ${ownerState.active &&
        css`
            color: ${ownerState.active};
            font-weight: 600;
        `}
    `,
);

const SeparatorContainer = createComponentSlot("div")<ToolbarBreadcrumbsClassKey>({
    componentName: "ToolbarBreadcrumbs",
    slotName: "separatorContainer",
})(css`
    height: 100%;
    padding-left: 15px;
    padding-right: 15px;
    display: flex;
    justify-content: center;
    align-items: center;
`);

const Separator = createComponentSlot("div")<ToolbarBreadcrumbsClassKey>({
    componentName: "ToolbarBreadcrumbs",
    slotName: "separator",
})(
    ({ theme }) => css`
        height: 30px;
        width: 1px;
        background-color: ${theme.palette.divider};
        transform: rotate(20deg);
    `,
);

const BreadcrumbLink = forwardRef<HTMLAnchorElement, RouterLinkProps>(({ href, to, ...rest }, ref) => (
    <RouterLink innerRef={ref} to={to ?? href} {...rest} />
));

export interface ToolbarBreadcrumbsProps
    extends ThemedComponentBaseProps<{
        item: "div";
        typographyRoot: typeof MuiTypography;
        separatorContainer: "div";
        separator: "div";
    }> {
    /**
     * @deprecated Use `slotProps` instead.
     */
    typographyProps?: TypographyTypeMap["props"];
}

export const ToolbarBreadcrumbs = (inProps: ToolbarBreadcrumbsProps) => {
    const { typographyProps, slotProps } = useThemeProps({ props: inProps, name: "CometAdminToolbarBreadcrumbs" });

    return (
        <StackApiContext.Consumer>
            {(stackApi) => {
                return (
                    <>
                        {stackApi?.breadCrumbs.map(({ id, url, title }, index) => {
                            const showSeparator = index < stackApi?.breadCrumbs.length - 1;

                            const ownerState: OwnerState = {
                                active: index === stackApi?.breadCrumbs.length - 1,
                            };

                            return (
                                <Fragment key={id}>
                                    <Item {...slotProps?.item}>
                                        <TypographyRoot ownerState={ownerState} {...typographyProps} {...slotProps?.typographyRoot}>
                                            <Link to={url} component={BreadcrumbLink} color="inherit">
                                                {title}
                                            </Link>
                                        </TypographyRoot>
                                    </Item>
                                    {showSeparator && (
                                        <SeparatorContainer {...slotProps?.separatorContainer}>
                                            <Separator {...slotProps?.separator} />
                                        </SeparatorContainer>
                                    )}
                                </Fragment>
                            );
                        })}
                    </>
                );
            }}
        </StackApiContext.Consumer>
    );
};
