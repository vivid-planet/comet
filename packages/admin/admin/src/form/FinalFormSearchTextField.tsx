import { Search } from "@comet/admin-icons";
import { InputAdornment } from "@mui/material";
import { useThemeProps } from "@mui/material/styles";
import { type ReactNode } from "react";
import type { FieldRenderProps } from "react-final-form";
import { useIntl } from "react-intl";

import { FinalFormInput, type FinalFormInputProps } from "./FinalFormInput";

export interface FinalFormSearchTextFieldProps extends FinalFormInputProps {
    icon?: ReactNode;
}

type FinalFormSearchTextFieldInternalProps = FieldRenderProps<string, HTMLInputElement | HTMLTextAreaElement>;

/**
 * Final Form-compatible SearchTextField component.
 *
 * @see {@link SearchField} – preferred for typical form use. Use this only if no Field wrapper is needed.
 */
export function FinalFormSearchTextField(inProps: FinalFormSearchTextFieldProps & FinalFormSearchTextFieldInternalProps) {
    const {
        icon = <Search />,
        placeholder,
        endAdornment,
        required,
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
            endAdornment={endAdornment}
            disableContentTranslation={true}
            required={required}
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
