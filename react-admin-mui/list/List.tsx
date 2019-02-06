import { List as MuiList } from "@material-ui/core";
import { ListProps } from "@material-ui/core/List";
import { IListItem, ListItem } from "@vivid-planet/react-admin-mui";
import * as React from "react";

export interface IListProps {
    items: IListItem[];
    level: number;
    showIconsOnly: boolean;
}

const List = ({ items, level, showIconsOnly, ...listProps }: IListProps & ListProps) => {
    return (
        <MuiList {...listProps}>
            {items.map((item, index) => (
                <ListItem key={index} {...{ level, showIconsOnly }} {...item} />
            ))}
        </MuiList>
    );
};

export default List;
