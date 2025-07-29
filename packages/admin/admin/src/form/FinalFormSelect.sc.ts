import { MenuItem, menuItemClasses } from "@mui/material";
import { styled } from "@mui/material/styles";

export const MenuItemDisabledOverrideOpacity = styled(MenuItem)({
    [`&.${menuItemClasses.disabled}`]: {
        opacity: 1.0,
    },
});

export const LinearLoadingContainer = styled("div")({
    minHeight: "2px",
});
