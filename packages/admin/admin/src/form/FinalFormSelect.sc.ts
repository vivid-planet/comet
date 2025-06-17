import { MenuItem, menuItemClasses } from "@mui/material";
import { styled } from "@mui/material/styles";

export const MenuItemDisabledOverrideOpacity = styled(MenuItem)({
    [`&.${menuItemClasses.disabled}`]: {
        opacity: 1.0,
    },

    height: "48px",
    cursor: "default",
});

export const MenuItemContainerContent = styled("div")`
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    margin: 0;
`;
