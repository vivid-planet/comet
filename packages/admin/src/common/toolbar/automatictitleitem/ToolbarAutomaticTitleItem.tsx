import { Typography } from "@material-ui/core";
import * as React from "react";

import { useStackApi } from "../../../stack/Api";
import { ToolbarItem } from "../item/ToolbarItem";
import { useThemeProps } from "./ToolbarAutomaticTitleItem.styles";

const ToolbarAutomaticTitleItem: React.FunctionComponent = () => {
    const stackApi = useStackApi();

    const themeProps = useThemeProps();

    return (
        <ToolbarItem>
            <Typography {...themeProps.typographyProps}>
                {stackApi?.breadCrumbs != null && stackApi.breadCrumbs.length > 0 && stackApi.breadCrumbs[stackApi?.breadCrumbs.length - 1].title}
            </Typography>
        </ToolbarItem>
    );
};

export { ToolbarAutomaticTitleItem };
