import { Translate } from "@comet/admin-icons";
import { IconButton, InputBase, type InputBaseProps } from "@mui/material";
import { useState } from "react";
import { type FieldRenderProps } from "react-final-form";
import { FormattedMessage } from "react-intl";

import { ClearInputAdornment } from "../common/ClearInputAdornment";
import { Tooltip } from "../common/Tooltip";
import { PlainTextTranslationDialog } from "../translator/PlainTextTranslationDialog";
import { useContentTranslationService } from "../translator/useContentTranslationService";

export type FinalFormInputProps = InputBaseProps & {
    clearable?: boolean;
    disableContentTranslation?: boolean;
};

type FinalFormInputInternalProps = FieldRenderProps<string, HTMLInputElement | HTMLTextAreaElement>;

export function FinalFormInput({
    meta,
    input,
    innerRef,
    endAdornment,
    clearable,
    disableContentTranslation,
    ...props
}: FinalFormInputProps & FinalFormInputInternalProps) {
    const type = props.type ?? input.type ?? "text";
    const { enabled: translationEnabled, showApplyTranslationDialog, translate } = useContentTranslationService();
    const isTranslatable = translationEnabled && !disableContentTranslation && type === "text" && !props.disabled;

    const [open, setOpen] = useState<boolean>(false);
    const [pendingTranslation, setPendingTranslation] = useState<string | undefined>(undefined);

    const { onChange, ...restInput } = input;

    const hadValueInitially = Boolean(meta.initial);
    const clearValue = hadValueInitially ? null : meta.initial;

    return (
        <>
            <InputBase
                {...restInput}
                {...props}
                onChange={(event) => {
                    if (event.target.value === "") {
                        return onChange(clearValue);
                    }

                    return onChange(event);
                }}
                endAdornment={
                    (endAdornment || clearable || isTranslatable) && (
                        <>
                            {clearable && (
                                <ClearInputAdornment position="end" hasClearableContent={Boolean(input.value)} onClick={() => onChange(clearValue)} />
                            )}
                            {isTranslatable && (
                                <Tooltip title={<FormattedMessage id="comet.translate" defaultMessage="Translate" />}>
                                    <IconButton
                                        onClick={async () => {
                                            if (showApplyTranslationDialog) {
                                                setPendingTranslation(await translate(input.value));
                                                setOpen(true);
                                            } else {
                                                onChange(await translate(input.value));
                                            }
                                        }}
                                    >
                                        <Translate />
                                    </IconButton>
                                </Tooltip>
                            )}
                            {endAdornment}
                        </>
                    )
                }
            />
            {open && pendingTranslation && (
                <PlainTextTranslationDialog
                    open={open}
                    onClose={() => setOpen(false)}
                    originalText={input.value}
                    translatedText={pendingTranslation}
                    onApplyTranslation={input.onChange}
                />
            )}
        </>
    );
}
