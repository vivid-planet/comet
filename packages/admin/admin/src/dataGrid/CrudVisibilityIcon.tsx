import { Disabled, Online } from "@comet/admin-icons";
import { useTheme } from "@mui/material";
import React from "react";

interface CrudVisibilityIconProps {
    visibility: boolean;
}

export function CrudVisibilityIcon({ visibility }: CrudVisibilityIconProps): JSX.Element {
    const theme = useTheme();

    if (visibility) {
        return <Online htmlColor={theme.palette.success.main} />;
    } else {
        return <Disabled />;
    }
}
