import { Translate } from "@comet/admin-icons";
import { IconButton, InputBase, type InputBaseProps } from "@mui/material";
import { useState } from "react";
import { type FieldRenderProps } from "react-final-form";
import { FormattedMessage } from "react-intl";

import { ClearInputAdornment } from "../common/ClearInputAdornment";
import { Tooltip } from "../common/Tooltip";
import { PlainTextTranslationDialog } from "../translator/PlainTextTranslationDialog";
import { useContentTranslationService } from "../translator/useContentTranslationService";

export type FinalFormInputProps = InputBaseProps &
    FieldRenderProps<string, HTMLInputElement | HTMLTextAreaElement> & {
        clearable?: boolean;
        disableContentTranslation?: boolean;
    };

export function FinalFormInput({ meta, input, innerRef, endAdornment, clearable, disableContentTranslation, ...props }: FinalFormInputProps) {
    const type = props.type ?? input.type ?? "text";
    const { enabled: translationEnabled, showApplyTranslationDialog, translate } = useContentTranslationService();
    const isTranslatable = translationEnabled && !disableContentTranslation && type === "text" && !props.disabled;

    const [open, setOpen] = useState<boolean>(false);
    const [pendingTranslation, setPendingTranslation] = useState<string | undefined>(undefined);

    return (
        <>
            <InputBase
                {...input}
                {...props}
                data-testid={input.name}
                slotProps={{
                    input: {
                        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                        // @ts-expect-error
                        "data-testid": `${input.name}-input`,
                    },
                }}
                endAdornment={
                    (endAdornment || clearable || isTranslatable) && (
                        <>
                            {clearable && (
                                <ClearInputAdornment position="end" hasClearableContent={Boolean(input.value)} onClick={() => input.onChange("")} />
                            )}
                            {isTranslatable && (
                                <Tooltip title={<FormattedMessage id="comet.translate" defaultMessage="Translate" />}>
                                    <IconButton
                                        onClick={async () => {
                                            if (showApplyTranslationDialog) {
                                                setPendingTranslation(await translate(input.value));
                                                setOpen(true);
                                            } else {
                                                input.onChange(await translate(input.value));
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
