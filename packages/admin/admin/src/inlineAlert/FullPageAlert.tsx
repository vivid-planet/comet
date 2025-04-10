import { type ComponentsOverrides, CssBaseline, type Theme } from "@mui/material";
import { css, useThemeProps } from "@mui/material/styles";

import { createComponentSlot } from "../helpers/createComponentSlot";
import { type ThemedComponentBaseProps } from "../helpers/ThemedComponentBaseProps";
import { InlineAlert, type InlineAlertProps } from "./InlineAlert";

export type FullPageAlertClassKey = "root" | "alert";

export type FullPageAlertProps = Omit<InlineAlertProps, "slotProps"> &
    ThemedComponentBaseProps<{
        root: "div";
        alert: typeof InlineAlert;
    }>;

/**
 * The FullPageAlert component is used to display a full-page alert, by wrapping the InlineAlert component.
 * It should be rendered instead of the MasterLayout component.
 */
export const FullPageAlert = (inProps: FullPageAlertProps) => {
    const { sx, className, slotProps, ...inlineAlertProps } = useThemeProps({ props: inProps, name: "CometAdminFullPageAlert" });

    return (
        <>
            {/* TODO: Find a solution to render CssBaseline globally, independant of the MasterLayout */}
            <CssBaseline />
            <Root sx={sx} className={className} {...slotProps?.root}>
                <Alert {...slotProps?.alert} {...inlineAlertProps} />
            </Root>
        </>
    );
};

const Root = createComponentSlot("div")<FullPageAlertClassKey>({
    componentName: "FullPageAlert",
    slotName: "root",
})(
    ({ theme }) => css`
        height: 100vh;
        display: flex;
        justify-content: center;
        align-items: center;
        padding: ${theme.spacing(2)};
    `,
);

const Alert = createComponentSlot(InlineAlert)<FullPageAlertClassKey>({
    componentName: "FullPageAlert",
    slotName: "alert",
})(css`
    flex: 1;
`);

declare module "@mui/material/styles" {
    interface ComponentsPropsList {
        CometAdminFullPageAlert: FullPageAlertProps;
    }

    interface ComponentNameToClassKey {
        CometAdminFullPageAlert: FullPageAlertClassKey;
    }

    interface Components {
        CometAdminFullPageAlert?: {
            defaultProps?: Partial<ComponentsPropsList["CometAdminFullPageAlert"]>;
            styleOverrides?: ComponentsOverrides<Theme>["CometAdminFullPageAlert"];
        };
    }
}
