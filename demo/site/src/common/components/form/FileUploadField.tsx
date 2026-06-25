import { type ReactNode, useId, useRef } from "react";
import { Controller, type ControllerProps, type FieldValues } from "react-hook-form";
import { useIntl } from "react-intl";

import { ChooseButton } from "./ChooseButton";
import { FieldContainer, type FieldContainerFieldProps } from "./FieldContainer";
import { FileItem } from "./FileItem";
import styles from "./FileUploadField.module.scss";
import { useFileUpload } from "./useFileUpload";

type FileUploadFieldProps<TFieldValues extends FieldValues> = Pick<ControllerProps<TFieldValues>, "name" | "control" | "rules"> &
    FieldContainerFieldProps & {
        accept?: string;
        disableMultiple?: boolean;
        buttonLabel?: ReactNode;
        validateFile?: (file: File) => string | undefined;
        onUploadingChange?: (isUploading: boolean) => void;
    };

export const FileUploadField = <TFieldValues extends FieldValues>({
    label,
    helperText,
    name,
    control,
    rules,
    accept,
    disableMultiple,
    buttonLabel,
    validateFile,
    onUploadingChange,
}: FileUploadFieldProps<TFieldValues>) => {
    const id = useId();
    const inputRef = useRef<HTMLInputElement | null>(null);
    const required = !!rules?.required;
    const intl = useIntl();
    const multiple = !disableMultiple;

    const onUploadedIdsChangeRef = useRef<(uploadedIds: string[]) => void>(() => undefined);
    const { attachments, handleSelect, handleRemove, hasErrors } = useFileUpload({
        multiple,
        validateFile,
        onUploadingChange,
        onUploadedIdsChange: (uploadedIds) => onUploadedIdsChangeRef.current(uploadedIds),
    });

    return (
        <Controller
            name={name}
            control={control}
            rules={{
                ...rules,
                validate: {
                    ...(rules?.validate ? (typeof rules.validate === "function" ? { custom: rules.validate } : rules.validate) : {}),
                    attachmentsHaveErrors: () =>
                        hasErrors()
                            ? intl.formatMessage({
                                  id: "fileUploadField.hasErrors",
                                  defaultMessage: "Please remove attachments that failed to upload.",
                              })
                            : true,
                },
            }}
            render={({ field, fieldState }) => {
                onUploadedIdsChangeRef.current = field.onChange;

                const erroredAttachment = attachments.find((attachment) => attachment.status === "error");
                const errorText = fieldState.error?.message ?? erroredAttachment?.errorMessage;
                const hasError = Boolean(errorText);

                return (
                    <FieldContainer required={required} label={label} helperText={helperText} errorText={errorText} htmlFor={id}>
                        <div className={styles.container}>
                            <input
                                ref={(node) => {
                                    inputRef.current = node;
                                    field.ref(node);
                                }}
                                id={id}
                                type="file"
                                accept={accept}
                                multiple={multiple}
                                name={field.name}
                                onBlur={field.onBlur}
                                onChange={handleSelect}
                                aria-invalid={hasError ? true : undefined}
                                className={styles.hiddenInput}
                            />
                            <ChooseButton label={buttonLabel} onClick={() => inputRef.current?.click()} />
                            {attachments.length > 0 && (
                                <ul className={styles.fileList}>
                                    {attachments.map((attachment) => (
                                        <FileItem key={attachment.key} attachment={attachment} onRemove={() => handleRemove(attachment.key)} />
                                    ))}
                                </ul>
                            )}
                        </div>
                    </FieldContainer>
                );
            }}
        />
    );
};
