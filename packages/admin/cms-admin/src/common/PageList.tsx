import { messages } from "@comet/admin";
import { ArrowLeft, File, Folder } from "@comet/admin-icons";
import { List, ListItem, ListItemIcon } from "@mui/material";
import { styled } from "@mui/material/styles";
import React from "react";
import { FormattedMessage } from "react-intl";

export interface PageListItem {
    id: string;
    name: string;
    path: string;
    type: "folder" | "page";
    selected?: boolean;
}

interface PageListProps {
    items: PageListItem[];
    showBackButton: boolean;
    onItemClick: (item: PageListItem) => void;
    onBackClick: () => void;
    siteUrl: string;
}

export function PageList({ items, showBackButton, onItemClick, onBackClick, siteUrl }: PageListProps): JSX.Element {
    return (
        <Root>
            {showBackButton && (
                <ListItem button divider onClick={onBackClick}>
                    <ListItemIcon>
                        <ArrowLeft />
                    </ListItemIcon>
                    <FormattedMessage {...messages.back} />
                </ListItem>
            )}
            <ScrollableListSection>
                {items.map((item) => (
                    <ListItem
                        key={`${item.id}-${item.type}`}
                        button
                        onClick={() => onItemClick?.(item)}
                        selected={item.selected}
                        title={item.type === "page" ? `${siteUrl}${item.path}` : undefined}
                    >
                        <ListItemIcon>{item.type === "page" ? <File /> : <Folder />}</ListItemIcon>
                        {item.name}
                    </ListItem>
                ))}
                {items.length === 0 && (
                    <ListItem>
                        <FormattedMessage id="comet.pages.pageList.noItems" defaultMessage="No items" />
                    </ListItem>
                )}
            </ScrollableListSection>
        </Root>
    );
}

const Root = styled(List)`
    width: 300px;
    padding: 0;
`;

const ScrollableListSection = styled("div")`
    max-height: 240px;
    overflow-y: auto;
`;
