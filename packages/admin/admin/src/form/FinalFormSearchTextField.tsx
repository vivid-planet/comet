import { Search } from "@comet/admin-icons";
import { InputAdornment } from "@mui/material";
import { useThemeProps } from "@mui/material/styles";
import * as React from "react";
import { useIntl } from "react-intl";

import { ClearInputAdornment } from "../common/ClearInputAdornment";
import { FinalFormInput, FinalFormInputProps } from "./FinalFormInput";

export interface FinalFormSearchTextFieldProps extends FinalFormInputProps {
    icon?: React.ReactNode;
    clearable?: boolean;
}

export function FinalFormSearchTextField(inProps: FinalFormSearchTextFieldProps) {
    const {
        icon = <Search />,
        placeholder,
        endAdornment,
        clearable,
        ...restProps
    } = useThemeProps({ props: inProps, name: "CometAdminFinalFormSearchTextField" });
    const intl = useIntl();

    return (
        <FinalFormInput
            {...restProps}
            placeholder={placeholder ?? intl.formatMessage({ id: "comet.finalformsearchtextfield.default.placeholder", defaultMessage: "Search" })}
            startAdornment={
                <InputAdornment position="start" disablePointerEvents>
                    {icon}
                </InputAdornment>
            }
            endAdornment={
                clearable ? (
                    <>
                        <ClearInputAdornment
                            position="end"
                            hasClearableContent={Boolean(restProps.input.value)}
                            onClick={() => restProps.input.onChange("")}
                        />
                        {endAdornment}
                    </>
                ) : (
                    endAdornment
                )
            }
        />
    );
}

declare module "@mui/material/styles" {
    interface ComponentsPropsList {
        CometAdminFinalFormSearchTextField: FinalFormSearchTextFieldProps;
    }

    interface Components {
        CometAdminFinalFormSearchTextField?: {
            defaultProps?: Partial<ComponentsPropsList["CometAdminFinalFormSearchTextField"]>;
        };
    }
}
