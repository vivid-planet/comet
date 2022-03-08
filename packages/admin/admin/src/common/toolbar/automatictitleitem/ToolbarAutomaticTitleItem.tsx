import { Typography } from "@material-ui/core";
import { TypographyTypeMap } from "@material-ui/core/Typography/Typography";
import { withStyles } from "@material-ui/styles";
import * as React from "react";

import { useStackApi } from "../../../stack/Api";
import { ToolbarItem } from "../item/ToolbarItem";

export interface ToolbarAutomaticTitleItemProps {
    typographyProps?: TypographyTypeMap["props"];
}

function AutomaticTitleItem({ typographyProps }: ToolbarAutomaticTitleItemProps): React.ReactElement {
    const stackApi = useStackApi();

    return (
        <ToolbarItem>
            <Typography variant={"h4"} {...typographyProps}>
                {stackApi?.breadCrumbs != null && stackApi.breadCrumbs.length > 0 && stackApi.breadCrumbs[stackApi?.breadCrumbs.length - 1].title}
            </Typography>
        </ToolbarItem>
    );
}

export const ToolbarAutomaticTitleItem = withStyles({}, { name: "CometAdminToolbarAutomaticTitleItem" })(AutomaticTitleItem);

declare module "@material-ui/core/styles/props" {
    interface ComponentsPropsList {
        CometAdminToolbarAutomaticTitleItem: ToolbarAutomaticTitleItemProps;
    }
}
