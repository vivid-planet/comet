import { Button, InputBase, InputBaseProps } from "@mui/material";
import * as React from "react";
import { FieldRenderProps } from "react-final-form";
import { FormattedMessage } from "react-intl";

import { ClearInputAdornment } from "../common/ClearInputAdornment";
import { useContentTranslationServiceProvider } from "../translator/config/useContentTranslationServiceProvider";

export type FinalFormInputProps = InputBaseProps &
    FieldRenderProps<string, HTMLInputElement | HTMLTextAreaElement> & {
        clearable?: boolean;
        disableTranslation?: boolean;
    };

export function FinalFormInput({
    meta,
    input,
    innerRef,
    endAdornment,
    clearable,
    disableTranslation,
    ...props
}: FinalFormInputProps): React.ReactElement {
    const { enabled, translate } = useContentTranslationServiceProvider();

    return (
        <InputBase
            {...input}
            {...props}
            endAdornment={
                <>
                    {clearable && (
                        <ClearInputAdornment position="end" hasClearableContent={Boolean(input.value)} onClick={() => input.onChange("")} />
                    )}
                    {enabled && !disableTranslation && (
                        <Button
                            onClick={async () => {
                                if (translate) {
                                    input.onChange(await translate(input.value));
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
