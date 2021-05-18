import { TypographyTypeMap } from "@material-ui/core/Typography/Typography";

import { useComponentThemeProps } from "../../../mui/useComponentThemeProps";

export interface ToolbarAutomaticTitleItemThemeProps {
    typographyProps: TypographyTypeMap["props"];
}

export function useThemeProps() {
    const { typographyProps, ...restProps } = useComponentThemeProps("CometAdminToolbarAutomaticTitleItem") ?? {};
    return { typographyProps, ...restProps };
}

declare module "@material-ui/core/styles/props" {
    interface ComponentsPropsList {
        CometAdminToolbarAutomaticTitleItem: ToolbarAutomaticTitleItemThemeProps;
    }
}
