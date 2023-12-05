import { Button, InputBase, InputBaseProps } from "@mui/material";
import * as React from "react";
import { FieldRenderProps } from "react-final-form";
import { FormattedMessage } from "react-intl";

import { ClearInputAdornment } from "../common/ClearInputAdornment";
import { useTranslationConfig } from "../translator/config/useTranslationConfig";

export type FinalFormInputProps = InputBaseProps &
    FieldRenderProps<string, HTMLInputElement | HTMLTextAreaElement> & {
        clearable?: boolean;
        hideTranslate?: boolean;
    };

export function FinalFormInput({ meta, input, innerRef, endAdornment, clearable, hideTranslate, ...props }: FinalFormInputProps): React.ReactElement {
    const { enableTranslation, translate } = useTranslationConfig();

    return (
        <InputBase
            {...input}
            {...props}
            endAdornment={
                <>
                    {clearable && (
                        <ClearInputAdornment position="end" hasClearableContent={Boolean(input.value)} onClick={() => input.onChange("")} />
                    )}
                    {enableTranslation && !hideTranslate && (
                        <Button
                            onClick={() => {
                                if (translate) {
                                    input.onChange(translate(input.value));
                                }
                            }}
                        >
                            <FormattedMessage id="comet.translate" defaultMessage="Translate" />
                        </Button>
                    )}
                    {endAdornment}
                </>
            }
        />
    );
}
