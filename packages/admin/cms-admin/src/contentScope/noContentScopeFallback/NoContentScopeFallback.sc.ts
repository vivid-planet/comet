import { List, ListItem } from "@mui/material";
import { styled } from "@mui/material/styles";

export const BulletList = styled(List)({
    listStyleType: "disc",
    paddingLeft: 16,
}) as typeof List;

export const BulletListItem = styled(ListItem)({
    display: "list-item",
    paddingLeft: 0,
}) as typeof ListItem;
