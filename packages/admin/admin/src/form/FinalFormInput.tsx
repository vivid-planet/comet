import { ArtificialIntelligence } from "@comet/admin-icons";
import { IconButton, InputBase, InputBaseProps } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import * as React from "react";
import { FieldInputProps, FieldRenderProps } from "react-final-form";

import { ClearInputAdornment } from "../common/ClearInputAdornment";
import { Loading } from "../common/Loading";
import { useMlService } from "../ml/useMlService";

export type FinalFormInputProps = InputBaseProps &
    FieldRenderProps<string, HTMLInputElement | HTMLTextAreaElement> & {
        clearable?: boolean;
        mlButton?: (input: FieldInputProps<string, HTMLInputElement | HTMLTextAreaElement>) => void;
        loading?: boolean;
    };

export function FinalFormInput({
    meta,
    input,
    innerRef,
    endAdornment,
    clearable,
    mlButton,
    loading,
    ...props
}: FinalFormInputProps): React.ReactElement {
    const theme = useTheme();
    const { enabled: MlEnabled } = useMlService();

    return (
        <InputBase
            {...input}
            {...props}
            endAdornment={
                <>
                    {clearable && (
                        <ClearInputAdornment position="end" hasClearableContent={Boolean(input.value)} onClick={() => input.onChange("")} />
                    )}
                    {mlButton && MlEnabled && (
                        <IconButton sx={{ color: theme.palette.primary.main }} onClick={() => mlButton(input)}>
                            {loading ? <Loading behavior="fillParent" fontSize="large" /> : <ArtificialIntelligence />}
                        </IconButton>
                    )}
                    {endAdornment}
                </>
            }
        />
    );
}
