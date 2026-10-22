import { Translate } from "@dextinity/admin-icons";
import { IconButton, Input, type InputProps, Tooltip } from "@dextinity/ui";
import { type ChangeEventHandler, type InputHTMLAttributes, type Ref, useState } from "react";
import type { FieldRenderProps } from "react-final-form";
import { FormattedMessage, useIntl } from "react-intl";

import { PlainTextTranslationDialog } from "../translator/PlainTextTranslationDialog";
import { useContentTranslationService } from "../translator/useContentTranslationService";
import { InputClearButton } from "./InputClearButton";

export type FinalFormInputProps = Omit<InputProps, "type" | "value" | "defaultValue" | "onChange" | "onValueChange" | "rows"> & {
    disableContentTranslation?: boolean;
    /** The input's `type`, e.g. `"password"`. `"textarea"` is the same as `multiline`. */
    type?: string;
    rows?: number;
    /** Used as `rows` when `rows` isn't set. */
    minRows?: number;
    /** @deprecated Has no effect: a multiline input has a fixed number of rows, and the user can resize it. */
    maxRows?: number;
    /** @deprecated Has no effect: the input always fills its field. */
    fullWidth?: boolean;
    /** Props for the `<input>` element. Its `type` takes precedence over `type`. */
    inputProps?: InputHTMLAttributes<HTMLInputElement> & Record<`data-${string}`, string>;
    inputRef?: Ref<HTMLInputElement>;
    /** Replaces the field's own change handler, for example to also track that the user changed the value. */
    onChange?: ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement>;
};

type FinalFormInputInternalProps = FieldRenderProps<string, HTMLInputElement | HTMLTextAreaElement>;

export function FinalFormInput({
    meta,
    input,
    innerRef,
    endAdornment,
    disableContentTranslation,
    required,
    disabled,
    readOnly,
    multiline: passedMultiline,
    rows,
    minRows,
    maxRows,
    fullWidth,
    variant,
    inputProps,
    inputRef,
    ...props
}: FinalFormInputProps & FinalFormInputInternalProps) {
    const intl = useIntl();
    const type = inputProps?.type ?? props.type ?? input.type ?? "text";
    const multiline = passedMultiline || type === "textarea";
    const { enabled: translationEnabled, showApplyTranslationDialog, translate } = useContentTranslationService();
    const isTranslatable = translationEnabled && !disableContentTranslation && (type === "text" || type === "textarea") && !disabled;

    const [open, setOpen] = useState<boolean>(false);
    const [pendingTranslation, setPendingTranslation] = useState<string | undefined>(undefined);

    const clearable = !required && !disabled && !readOnly;
    const translateLabel = intl.formatMessage({ id: "dextinity.translate", defaultMessage: "Translate" });

    return (
        <>
            <Input
                {...input}
                {...props}
                {...inputProps}
                ref={inputRef}
                type={multiline ? undefined : type}
                multiline={multiline}
                rows={rows ?? minRows}
                required={required}
                disabled={disabled}
                readOnly={readOnly}
                endAdornment={
                    (endAdornment || clearable || isTranslatable) && (
                        <>
                            {clearable && input.value && <InputClearButton onClick={() => input.onChange("")} />}
                            {isTranslatable && (
                                <Tooltip content={<FormattedMessage id="dextinity.translate" defaultMessage="Translate" />}>
                                    <IconButton
                                        label={translateLabel}
                                        size="small"
                                        onClick={async () => {
                                            if (showApplyTranslationDialog) {
                                                setPendingTranslation(await translate(input.value));
                                                setOpen(true);
                                            } else {
                                                input.onChange(await translate(input.value));
                                            }
                                        }}
                                    >
                                        <Translate fontSize="inherit" />
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
                    multiline={multiline}
                />
            )}
        </>
    );
}
