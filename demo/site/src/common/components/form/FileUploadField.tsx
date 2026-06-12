import { SvgUse } from "@src/common/helpers/SvgUse";
import clsx from "clsx";
import { type ChangeEvent, type ReactNode, useId, useRef } from "react";
import { Controller, type ControllerProps, type FieldValues } from "react-hook-form";
import { FormattedMessage, useIntl } from "react-intl";

import { FieldContainer, type FieldContainerFieldProps } from "./FieldContainer";
import styles from "./FileUploadField.module.scss";

export type Attachment = {
    key: string;
    file: File;
    status: "uploading" | "uploaded" | "error";
    id?: string;
    errorMessage?: string;
};

export const getAttachmentIds = (attachments: Attachment[]): string[] =>
    attachments.flatMap((attachment) => (attachment.status === "uploaded" && attachment.id ? [attachment.id] : []));

export const areAttachmentsSettled = (attachments: Attachment[]): boolean => attachments.every((attachment) => attachment.status !== "uploading");

type FileUploadFieldProps<TFieldValues extends FieldValues> = Pick<ControllerProps<TFieldValues>, "name" | "control" | "rules"> &
    FieldContainerFieldProps & {
        accept?: string;
        multiple?: boolean;
        buttonLabel?: ReactNode;
        uploadFile: (file: File) => Promise<{ id: string }>;
        validateFile?: (file: File) => string | undefined;
    };

export const FileUploadField = <TFieldValues extends FieldValues>({
    label,
    helperText,
    name,
    control,
    rules,
    accept,
    multiple = true,
    buttonLabel,
    uploadFile,
    validateFile,
}: FileUploadFieldProps<TFieldValues>) => {
    const id = useId();
    const inputRef = useRef<HTMLInputElement | null>(null);
    const attachmentsRef = useRef<Attachment[]>([]);
    const required = !!rules?.required;
    const intl = useIntl();

    return (
        <Controller
            name={name}
            control={control}
            rules={rules}
            render={({ field, fieldState }) => {
                const attachments: Attachment[] = Array.isArray(field.value) ? field.value : [];
                attachmentsRef.current = attachments;

                const setAttachments = (next: Attachment[]) => {
                    attachmentsRef.current = next;
                    field.onChange(next);
                };

                const patchAttachment = (attachmentKey: string, patch: Partial<Attachment>) => {
                    setAttachments(
                        attachmentsRef.current.map((attachment) => (attachment.key === attachmentKey ? { ...attachment, ...patch } : attachment)),
                    );
                };

                const handleSelect = async (event: ChangeEvent<HTMLInputElement>) => {
                    const selected = event.target.files ? Array.from(event.target.files) : [];
                    event.target.value = "";

                    const added: Attachment[] = selected.map((file) => {
                        const validationError = validateFile?.(file);
                        return {
                            key: crypto.randomUUID(),
                            file,
                            status: validationError ? "error" : "uploading",
                            errorMessage: validationError,
                        };
                    });

                    setAttachments(multiple ? [...attachmentsRef.current, ...added] : added);

                    for (const attachment of added) {
                        if (attachment.status === "error") {
                            continue;
                        }
                        try {
                            const { id: uploadedId } = await uploadFile(attachment.file);
                            patchAttachment(attachment.key, { status: "uploaded", id: uploadedId });
                        } catch (error) {
                            console.error(error);
                            patchAttachment(attachment.key, {
                                status: "error",
                                errorMessage: intl.formatMessage({
                                    id: "fileUploadField.uploadFailed",
                                    defaultMessage: "Upload failed. Please try again.",
                                }),
                            });
                        }
                    }
                };

                const handleRemove = (attachmentKey: string) => {
                    setAttachments(attachmentsRef.current.filter((attachment) => attachment.key !== attachmentKey));
                };

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
                            <button type="button" className={styles.chooseButton} onClick={() => inputRef.current?.click()}>
                                <SvgUse href="/assets/icons/add-file.svg#root" width={16} height={16} />
                                {buttonLabel ?? <FormattedMessage id="fileUploadField.chooseFiles" defaultMessage="Choose files" />}
                            </button>
                            {attachments.length > 0 && (
                                <ul className={styles.fileList}>
                                    {attachments.map((attachment) => (
                                        <li
                                            key={attachment.key}
                                            className={clsx(styles.fileItem, attachment.status === "error" && styles["fileItem--error"])}
                                        >
                                            <SvgUse
                                                href={`/assets/icons/${attachment.status === "error" ? "file-error" : "file"}.svg#root`}
                                                width={16}
                                                height={16}
                                                className={styles.fileIcon}
                                            />
                                            <span className={styles.fileName} title={attachment.errorMessage ?? attachment.file.name}>
                                                {attachment.file.name}
                                            </span>
                                            <button
                                                type="button"
                                                className={styles.removeButton}
                                                onClick={() => handleRemove(attachment.key)}
                                                aria-label={intl.formatMessage(
                                                    { id: "fileUploadField.removeFile", defaultMessage: "Remove {fileName}" },
                                                    { fileName: attachment.file.name },
                                                )}
                                            >
                                                <SvgUse href="/assets/icons/delete.svg#root" width={16} height={16} />
                                            </button>
                                        </li>
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
