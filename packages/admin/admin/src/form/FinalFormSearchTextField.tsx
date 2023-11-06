import { Search } from "@comet/admin-icons";
import { InputAdornment } from "@mui/material";
import { withStyles } from "@mui/styles";
import * as React from "react";
import { useIntl } from "react-intl";

import { ClearInputAdornment } from "../common/ClearInputAdornment";
import { FinalFormInput, FinalFormInputProps } from "./FinalFormInput";

export interface FinalFormSearchTextFieldProps extends FinalFormInputProps {
    icon?: React.ReactNode;
    clearable?: boolean;
}

function SearchTextField({
    icon = <Search />,
    placeholder,
    endAdornment,
    clearable,
    ...restProps
}: FinalFormSearchTextFieldProps): React.ReactElement {
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

export const FinalFormSearchTextField = withStyles({}, { name: "CometAdminFinalFormSearchTextField" })(SearchTextField);

declare module "@mui/material/styles" {
    interface ComponentsPropsList {
        CometAdminFinalFormSearchTextField: Partial<FinalFormSearchTextFieldProps>;
    }

    interface Components {
        CometAdminFinalFormSearchTextField?: {
            defaultProps?: ComponentsPropsList["CometAdminFinalFormSearchTextField"];
        };
    }
}
