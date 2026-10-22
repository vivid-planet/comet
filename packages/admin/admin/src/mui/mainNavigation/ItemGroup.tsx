import { css, styled } from "@mui/material/styles";
import { Children, cloneElement, isValidElement, type ReactElement, type ReactNode, useMemo } from "react";
import { FormattedMessage, type MessageDescriptor, useIntl } from "react-intl";

import type { MainNavigationChild, MainNavigationCollapsibleItemProps } from "./CollapsibleItem";
import type { MainNavigationItemProps } from "./Item";
import type { MainNavigationItemRouterLinkProps } from "./ItemRouterLink";

export type MainNavigationItemGroupClassKey = "root" | "open" | "tooltip" | "titleContainer" | "title" | "shortTitle";

const GroupRoot = styled("li")(
    ({ theme }) => css`
        margin-block-start: ${theme.spacing(6)};
        list-style: none;
    `,
);

const GroupTitle = styled("div")(
    ({ theme }) => css`
        display: flex;
        gap: ${theme.spacing(1)};
        align-items: center;
        padding: ${theme.spacing(2, 3)};
        color: ${theme.palette.text.secondary};
        font-size: 0.75rem;
        font-weight: 600;
        letter-spacing: 0.06em;
        text-transform: uppercase;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    `,
);

const GroupList = styled("ul")`
    margin: 0;
    padding: 0;
`;

export interface MainNavigationItemGroupProps {
    title: ReactNode;
    shortTitle?: ReactNode;
    helperIcon?: ReactNode;
    children?: ReactNode;
    isMenuOpen?: boolean;
}

export const MainNavigationItemGroup = ({ title, shortTitle, helperIcon, children, isMenuOpen }: MainNavigationItemGroupProps) => {
    const intl = useIntl();

    function isFormattedMessage(node: ReactNode): node is ReactElement<MessageDescriptor> {
        return !!node && isValidElement(node) && node.type === FormattedMessage;
    }

    function getInitials(title: ReactNode) {
        let titleAsString: string;
        if (typeof title === "string") {
            titleAsString = title;
        } else if (isFormattedMessage(title)) {
            titleAsString = intl.formatMessage(title.props);
        } else {
            throw new TypeError("Title must be either a string or a FormattedMessage");
        }
        const words = titleAsString.split(/\s+/).filter((word) => word.match(/[A-Za-z]/));
        return words
            .slice(0, 3)
            .map((word) => word[0].toUpperCase())
            .join("");
    }

    const childElements = useMemo(
        () =>
            Children.map(children, (child: MainNavigationChild) => {
                return cloneElement<MainNavigationCollapsibleItemProps | MainNavigationItemRouterLinkProps | MainNavigationItemProps>(child, {
                    isMenuOpen,
                });
            }),
        [children, isMenuOpen],
    );

    return (
        <GroupRoot>
            <GroupTitle>
                {isMenuOpen ? title : shortTitle || getInitials(title)}
                {isMenuOpen && !!helperIcon && helperIcon}
            </GroupTitle>
            <GroupList>{childElements}</GroupList>
        </GroupRoot>
    );
};
