import { Typography } from "@material-ui/core";
import * as React from "react";

import { ToolbarItem } from "../item/ToolbarItem";
import { useThemeProps } from "./ToolbarTitleItem.styles";

const ToolbarTitleItem: React.FunctionComponent = ({ children }) => {
    const themeProps = useThemeProps();

    return (
        <ToolbarItem>
            <Typography {...themeProps.typographyProps}>{children}</Typography>
        </ToolbarItem>
    );
};

export { ToolbarTitleItem };
