import { Search } from "@comet/admin-icons";
import { InputAdornment, InputAdornmentProps } from "@material-ui/core";
import { withStyles } from "@material-ui/styles";
import * as React from "react";
import { useIntl } from "react-intl";
import styled from "styled-components";

import { ClearInputButton } from "..";
import { FinalFormInput, FinalFormInputProps } from "./FinalFormInput";

interface ClearInputAdornmentProps extends InputAdornmentProps {
    $hidden: boolean;
}

const ClearInputAdornment = styled(InputAdornment)<ClearInputAdornmentProps>`
    visibility: ${({ $hidden }) => ($hidden ? "hidden" : "initial")};
`;

export interface FinalFormSearchTextFieldProps extends FinalFormInputProps {
    icon?: React.ReactNode;
}

function SearchTextField({ icon = <Search />, placeholder, endAdornment, ...restProps }: FinalFormSearchTextFieldProps): React.ReactElement {
    const intl = useIntl();

    return (
        <FinalFormInput
            {...restProps}
            placeholder={placeholder ?? intl.formatMessage({ id: "comet.finalformsearchtextfield.default.placeholder", defaultMessage: "Search" })}
            startAdornment={<InputAdornment position="start">{icon}</InputAdornment>}
            endAdornment={
                endAdornment ?? (
                    <ClearInputAdornment position="end" $hidden={restProps.input.value.length === 0}>
                        <ClearInputButton
                            onClick={() => {
                                restProps.input.onChange("");
                            }}
                        />
                    </ClearInputAdornment>
                )
            }
        />
    );
}

export const FinalFormSearchTextField = withStyles({}, { name: "CometAdminFinalFormSearchTextField" })(SearchTextField);

declare module "@material-ui/core/styles/props" {
    interface ComponentsPropsList {
        CometAdminFinalFormSearchTextField: FinalFormSearchTextFieldProps;
    }
}
