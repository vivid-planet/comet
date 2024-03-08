import { ComponentsOverrides, Typography, TypographyTypeMap } from "@mui/material";
import { Theme, useThemeProps } from "@mui/material/styles";
import * as React from "react";

import { createSlot } from "../../../helpers/createSlot";
import { ThemedComponentBaseProps } from "../../../helpers/ThemedComponentBaseProps";
import { useStackApi } from "../../../stack/Api";
import { ToolbarItem } from "../item/ToolbarItem";

export interface ToolbarAutomaticTitleItemProps
    extends ThemedComponentBaseProps<{
        root: typeof ToolbarItem;
        typography: typeof Typography;
    }> {
    /**
     * @deprecated Use `slotProps` instead.
     */
    typographyProps?: TypographyTypeMap["props"];
}

const Root = createSlot(ToolbarItem)<ToolbarAutomaticTitleItemClassKey>({
    componentName: "ToolbarAutomaticTitleItem",
    slotName: "root",
})();

export type ToolbarAutomaticTitleItemClassKey = "root" | "typography";

export const ToolbarAutomaticTitleItem = (inProps: ToolbarAutomaticTitleItemProps) => {
    const { typographyProps = {}, slotProps, ...restProps } = useThemeProps({ props: inProps, name: "CometAdminToolbarAutomaticTitleItem" });
    const stackApi = useStackApi();

    return (
        <Root {...slotProps?.root} {...restProps}>
            <Typography variant="h4" {...typographyProps} {...slotProps?.typography}>
                {stackApi?.breadCrumbs != null && stackApi.breadCrumbs.length > 0 && stackApi.breadCrumbs[stackApi?.breadCrumbs.length - 1].title}
            </Typography>
        </Root>
    );
};

declare module "@mui/material/styles" {
    interface ComponentNameToClassKey {
        CometAdminToolbarAutomaticTitleItem: ToolbarAutomaticTitleItemClassKey;
    }
    interface ComponentsPropsList {
        CometAdminToolbarAutomaticTitleItem: ToolbarAutomaticTitleItemProps;
    }

    interface Components {
        CometAdminToolbarAutomaticTitleItem?: {
            defaultProps?: Partial<ComponentsPropsList["CometAdminToolbarAutomaticTitleItem"]>;
            styleOverrides?: ComponentsOverrides<Theme>["CometAdminToolbarAutomaticTitleItem"];
        };
    }
}
