// TODO: Add theming and support for `sx` and `slotProps` when #1809 is merged: https://github.com/vivid-planet/comet/pull/1809
import { ChevronDown, ChevronRight, ChevronUp } from "@comet/admin-icons";
import {} from "@emotion/react";
import { ButtonBase, css, ListItemText, Menu, MenuItem, styled, Theme, Typography } from "@mui/material";
import React from "react";
import { Link as RouterLink, LinkProps as RouterLinkProps } from "react-router-dom";

import { useStackApi } from "../../stack/Api";
import { useObservedWidth } from "../../stack/breadcrumbs/utils"; // TODO: Update import when merged: https://github.com/vivid-planet/comet/pull/1755

// TODO: Remove debug code when we have stories for the new Toolbar to simulate a large stack
const __DEBUG__numberOfPages = 6;
const __DEBUG__dummyStackPages = [
    { title: "Lorem ipsum", url: "/lorem-ipsum" },
    { title: "Foo Bar", url: "/foo-bar" },
    { title: "Nested page", url: "/nested-page" },
    { title: "Another page", url: "/another-page" },
    { title: "More nested pages", url: "/more-nested-pages" },
    { title: "And even more nested pages", url: "/and-even-more-nested-pages" },
    { title: "Foo", url: "/foo" },
    { title: "Lorem", url: "/lorem" },
    { title: "More pages", url: "/more-pages" },
];
const __DEBUG__usedNumberOfStackPages = __DEBUG__dummyStackPages.slice(0, __DEBUG__numberOfPages);
const __DEBUG__useDebugBreadcrumbData = false;

const BreadcrumbLink = React.forwardRef<HTMLAnchorElement, RouterLinkProps>(({ to, ...rest }, ref) => (
    <RouterLink innerRef={ref} to={to} {...rest} />
));

export type ToolbarBreadcrumbsProps = {
    scopeIndicator?: React.ReactNode;
};

export const ToolbarBreadcrumbs = ({ scopeIndicator }: ToolbarBreadcrumbsProps) => {
    const [showMobileMenu, setShowMobileMenu] = React.useState(false);
    const rootRef = React.useRef<HTMLDivElement>(null);
    const stackApi = useStackApi();

    const breadcrumbs = __DEBUG__useDebugBreadcrumbData ? __DEBUG__usedNumberOfStackPages : stackApi?.breadCrumbs ?? [];
    const menuWidth = useObservedWidth(rootRef);

    if (!breadcrumbs.length) {
        return null;
    }

    const lastBreadcrumb = breadcrumbs[breadcrumbs.length - 1];

    const toggleMobileMenu = () => {
        setShowMobileMenu((val) => !val);
    };

    return (
        <>
            <Root ref={rootRef}>
                {Boolean(scopeIndicator) && scopeIndicator}
                <DesktopBreadcrumbs>
                    <EllipsisItem variant="body2" onClick={toggleMobileMenu}>
                        ...
                    </EllipsisItem>
                    {breadcrumbs.map(({ title, url }, index) => {
                        const isCurrentPage = index === breadcrumbs.length - 1;

                        const commonItemProps = {
                            variant: "body2",
                            title,
                        } as const;

                        return (
                            <React.Fragment key={index}>
                                {isCurrentPage ? (
                                    // @ts-expect-error TODO: Fix this. May be fixed when creating the component with `createComponentSlot()` from #1809
                                    <LastItem {...commonItemProps}>{title}</LastItem>
                                ) : (
                                    <>
                                        {/* @ts-expect-error TODO: Fix this. May be fixed when creating the component with `createComponentSlot()` from #1809 */}
                                        <Item {...commonItemProps} component={BreadcrumbLink} to={url}>
                                            {title}
                                        </Item>
                                        <ItemSeparator>
                                            <ChevronRight />
                                        </ItemSeparator>
                                    </>
                                )}
                            </React.Fragment>
                        );
                    })}
                </DesktopBreadcrumbs>
                <MobileBreadrumbs onClick={toggleMobileMenu} disableRipple>
                    <Typography
                        variant="body2"
                        sx={{
                            textDecoration: "underline",
                        }}
                    >
                        ...
                    </Typography>
                    <ChevronRight />
                    <LastItem variant="body2">{lastBreadcrumb.title}</LastItem>
                    <MobileMenuButtonWrapper>{showMobileMenu ? <ChevronUp /> : <ChevronDown />}</MobileMenuButtonWrapper>
                </MobileBreadrumbs>
            </Root>
            <Menu
                open={showMobileMenu}
                anchorEl={rootRef.current}
                onClose={toggleMobileMenu}
                anchorOrigin={{
                    vertical: "bottom",
                    horizontal: "center",
                }}
                transformOrigin={{
                    vertical: "top",
                    horizontal: "center",
                }}
                MenuListProps={{
                    // @ts-expect-error This works but the `component` prop seems to be missing in the type definitions
                    component: "div",
                    sx: {
                        paddingTop: 3,
                        paddingBottom: 3,
                    },
                }}
                PaperProps={{
                    sx: {
                        width: menuWidth,
                    },
                }}
            >
                {breadcrumbs.map(({ title, url }, nestingLevel) => {
                    const isCurrentPage = nestingLevel === breadcrumbs.length - 1;

                    return (
                        <MobileMenuItem key={nestingLevel} onClick={toggleMobileMenu} selected={isCurrentPage} to={url} component={BreadcrumbLink}>
                            {nestingLevel > 0 && <MenuItemNestingIndicator nestingLevel={nestingLevel} />}
                            <ListItemText
                                primary={title}
                                primaryTypographyProps={{
                                    sx: {
                                        fontWeight: isCurrentPage ? 600 : 300,
                                        textOverflow: "ellipsis",
                                        overflow: "hidden",
                                    },
                                }}
                            />
                        </MobileMenuItem>
                    );
                })}
            </Menu>
        </>
    );
};

const Root = styled("div")(
    ({ theme }) => css`
        display: flex;
        align-items: center;
        gap: ${theme.spacing(2)};
        padding-left: ${theme.spacing(2)};
        padding-right: ${theme.spacing(2)};
    `,
);

const DesktopBreadcrumbs = styled("div")(
    ({ theme }) => css`
        display: none;
        align-items: center;
        gap: ${theme.spacing(1)};
        overflow: hidden;

        ${theme.breakpoints.up("md")} {
            display: flex;
        }
    `,
);

const MobileBreadrumbs = styled(ButtonBase)(
    ({ theme }) => css`
        display: flex;
        align-items: center;
        gap: ${theme.spacing(1)};
        flex-grow: 1;
        overflow: hidden;
        padding-top: ${theme.spacing(2)};
        padding-bottom: ${theme.spacing(2)};

        ${theme.breakpoints.up("md")} {
            display: none;
        }
    `,
);

const getCommonItemStyles = (theme: Theme) => css`
    color: ${theme.palette.grey[900]};
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;

    ${theme.breakpoints.up("md")} {
        padding-top: ${theme.spacing(2)};
        padding-bottom: ${theme.spacing(2)};
    }
`;

const Item = styled(Typography)(
    ({ theme }) => css`
        ${getCommonItemStyles(theme)}

        ${theme.breakpoints.up("md")} {
            display: block;
        }
    `,
) as typeof Typography;

const LastItem = styled(Typography)(
    ({ theme }) => css`
        ${getCommonItemStyles(theme)}
        font-weight: 600;
    `,
) as typeof Typography;

const EllipsisItem = styled(Typography)(
    ({ theme }) => css`
        color: ${theme.palette.grey[900]};
        text-decoration: underline;
        padding: ${theme.spacing(1)};
        margin-left: ${theme.spacing(-1)};
        margin-right: ${theme.spacing(-1)};
        cursor: pointer;

        ${theme.breakpoints.up("md")} {
            display: none;
        }
    `,
) as typeof Typography;

const MobileMenuButtonWrapper = styled("div")`
    margin-left: auto;
    line-height: 0;
`;

const ItemSeparator = styled("div")(
    ({ theme }) => css`
        line-height: 0;
        display: none;

        :nth-last-of-type(2) {
            display: block;
        }

        ${theme.breakpoints.up("md")} {
            display: block;
        }
    `,
);

const MobileMenuItem = styled(MenuItem)(
    ({ theme }) => css`
        position: relative;
        min-height: auto;
        padding-left: ${theme.spacing(3)};
        padding-right: ${theme.spacing(3)};
        padding-top: 8px;
        padding-bottom: 8px;

        :hover,
        &.Mui-selected,
        &.Mui-focusVisible,
        &.Mui-selected.Mui-focusVisible,
        &.Mui-selected:hover {
            background-color: ${theme.palette.grey[50]};
        }
    `,
) as typeof MenuItem;

const MenuItemNestingIndicator = styled("div")<{ nestingLevel: number }>(
    ({ theme, nestingLevel }) => css`
        position: relative;
        margin-left: ${17 * nestingLevel}px;
        width: 12px;
        flex-shrink: 0;

        :before {
            content: "";
            position: absolute;
            top: -18px;
            left: 0;
            width: 5px;
            height: 15px;
            border-width: 0 0 1px 1px;
            border-style: solid;
            border-color: ${theme.palette.grey[100]};
            box-sizing: border-box;
        }
    `,
);
