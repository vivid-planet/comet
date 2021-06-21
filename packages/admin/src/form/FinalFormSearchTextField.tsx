import { Search } from "@comet/admin-icons";
import { InputAdornment } from "@material-ui/core";
import * as React from "react";
import { useIntl } from "react-intl";

import { useComponentThemeProps } from "../mui/useComponentThemeProps";
import { FinalFormInput, FinalFormInputProps } from "./FinalFormInput";

export interface CometAdminFinalFormSearchTextFieldThemeProps {
    icon?: React.ReactNode;
}

export function FinalFormSearchTextField({ icon, placeholder, ...restProps }: FinalFormInputProps): React.ReactElement {
    const intl = useIntl();
    const themeProps = useThemeProps();

    return (
        <FinalFormInput
            {...restProps}
            placeholder={placeholder ?? intl.formatMessage({ id: "comet.finalformsearchtextfield.default.placeholder", defaultMessage: "Search" })}
            startAdornment={<InputAdornment position="start">{icon ?? themeProps.icon}</InputAdornment>}
        />
    );
}

export function useThemeProps() {
    const { icon = <Search />, ...restProps } = useComponentThemeProps("CometAdminFinalFormSearchTextField") ?? {};
    return { icon, ...restProps };
}

declare module "@material-ui/core/styles/props" {
    interface ComponentsPropsList {
        CometAdminFinalFormSearchTextField: CometAdminFinalFormSearchTextFieldThemeProps;
    }
}
