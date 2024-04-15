import { Translate } from "@comet/admin-icons";
import { IconButton, InputBase, InputBaseProps, Tooltip } from "@mui/material";
import * as React from "react";
import { FieldRenderProps } from "react-final-form";
import { FormattedMessage } from "react-intl";

import { ClearInputAdornment } from "../common/ClearInputAdornment";
import { useContentTranslationService } from "../translator/useContentTranslationService";

export type FinalFormInputProps = InputBaseProps &
    FieldRenderProps<string, HTMLInputElement | HTMLTextAreaElement> & {
        clearable?: boolean;
        disableContentTranslation?: boolean;
    };

export function FinalFormInput({
    meta,
    input,
    innerRef,
    endAdornment,
    clearable,
    disableContentTranslation,
    ...props
}: FinalFormInputProps): React.ReactElement {
    const type = props.type ?? input.type ?? "text";
    const { enabled: translationEnabled, translate } = useContentTranslationService();
    const isTranslatable = translationEnabled && !disableContentTranslation && type === "text" && !props.disabled;

    return (
        <InputBase
            {...input}
            {...props}
            endAdornment={
                <>
                    {clearable && (
                        <ClearInputAdornment position="end" hasClearableContent={Boolean(input.value)} onClick={() => input.onChange("")} />
                    )}
                    {isTranslatable && (
                        <Tooltip title={<FormattedMessage id="comet.translate" defaultMessage="Translate" />}>
                            <IconButton onClick={async () => input.onChange(await translate(input.value))}>
                                <Translate />
                            </IconButton>
                        </Tooltip>
                    )}
                    {endAdornment}
                </>
            }
        />
    );
}
