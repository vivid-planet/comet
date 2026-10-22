import { Icon } from "@dextinity/ui";
import type { ReactNode } from "react";
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
export function FinalFormSearchTextField({
    icon = <Icon name="search" />,
    placeholder,
    ...restProps
}: FinalFormSearchTextFieldProps & FinalFormSearchTextFieldInternalProps) {
    const intl = useIntl();

    return (
        <FinalFormInput
            {...restProps}
            placeholder={
                placeholder ?? intl.formatMessage({ id: "dextinity.finalformsearchtextfield.default.placeholder", defaultMessage: "Search" })
            }
            startAdornment={icon}
            disableContentTranslation={true}
        />
    );
}

// Kept so that themes setting these keep compiling, although FinalFormSearchTextField no longer reads the MUI theme.
declare module "@mui/material/styles" {
    interface ComponentsPropsList {
        DextinityAdminFinalFormSearchTextField: FinalFormSearchTextFieldProps;
    }

    interface Components {
        DextinityAdminFinalFormSearchTextField?: {
            /** @deprecated Has no effect: FinalFormSearchTextField is built on `@dextinity/ui` and doesn't read the MUI theme. */
            defaultProps?: Partial<ComponentsPropsList["DextinityAdminFinalFormSearchTextField"]>;
        };
    }
}
