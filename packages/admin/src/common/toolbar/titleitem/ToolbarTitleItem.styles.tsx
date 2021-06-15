import { TypographyTypeMap } from "@material-ui/core/Typography/Typography";

import { useComponentThemeProps } from "../../../mui/useComponentThemeProps";

export interface ToolbarTitleItemThemeProps {
    typographyProps: TypographyTypeMap["props"];
}

export function useThemeProps() {
    const { typographyProps = { variant: "h4" }, ...restProps } = useComponentThemeProps("CometAdminToolbarTitleItem") ?? {};
    return { typographyProps, ...restProps };
}

declare module "@material-ui/core/styles/props" {
    interface ComponentsPropsList {
        CometAdminToolbarTitleItem: ToolbarTitleItemThemeProps;
    }
}
