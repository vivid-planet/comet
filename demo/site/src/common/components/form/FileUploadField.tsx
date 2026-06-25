import { getRecaptchaToken } from "@src/util/recaptcha/getRecaptchaToken";
import { useSiteConfig } from "@src/util/SiteConfigProvider";
import { useParams } from "next/navigation";
import { type ChangeEvent, type ReactNode, useId, useRef, useState } from "react";
import { type ControllerProps, type FieldValues, useController } from "react-hook-form";
import { useIntl } from "react-intl";

import { ChooseFilesButton } from "./ChooseFilesButton";
import { FieldContainer, type FieldContainerFieldProps } from "./FieldContainer";
import { type Attachment, FileList } from "./FileList";
import styles from "./FileUploadField.module.scss";

const getUploadedIds = (attachments: Attachment[]): string[] =>
    attachments.flatMap((attachment) => (attachment.status === "uploaded" && attachment.id ? [attachment.id] : []));

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
    const intl = useIntl();
    const inputRef = useRef<HTMLInputElement | null>(null);
    const required = !!rules?.required;
    const multiple = !disableMultiple;

    const { recaptchaSiteKey } = useSiteConfig();
    const params = useParams<{ language: string }>();
    const language = params?.language;

    const [attachments, setAttachments] = useState<Attachment[]>([]);
    const attachmentsRef = useRef<Attachment[]>(attachments);
    attachmentsRef.current = attachments;

    const { field, fieldState } = useController({
        name,
        control,
        rules: {
            ...rules,
            validate: {
                ...(rules?.validate ? (typeof rules.validate === "function" ? { custom: rules.validate } : rules.validate) : {}),
                attachmentsHaveErrors: () =>
                    attachmentsRef.current.some((attachment) => attachment.status === "error")
                        ? intl.formatMessage({
                              id: "fileUploadField.hasErrors",
                              defaultMessage: "Please remove attachments that failed to upload.",
                          })
                        : true,
            },
        },
    });

    const updateAttachments = (next: Attachment[]) => {
        attachmentsRef.current = next;
        setAttachments(next);
        field.onChange(getUploadedIds(next));
    };

    const patchAttachment = (attachmentKey: string, patch: Partial<Attachment>) => {
        updateAttachments(attachmentsRef.current.map((attachment) => (attachment.key === attachmentKey ? { ...attachment, ...patch } : attachment)));
    };

    const uploadFile = async (file: File): Promise<{ id: string }> => {
        if (!recaptchaSiteKey) {
            throw new Error("Missing recaptchaSiteKey in siteConfig");
        }
        const recaptchaToken = await getRecaptchaToken("file_upload", recaptchaSiteKey);

        const body = new FormData();
        body.append("file", file, file.name);
        body.append("recaptchaToken", recaptchaToken);

        const response = await fetch(`/${language}/api/file-upload`, {
            method: "POST",
            body,
        });

        if (!response.ok) {
            throw new Error(`File upload failed for ${file.name}`);
        }

        return (await response.json()) as { id: string };
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

        updateAttachments(multiple ? [...attachmentsRef.current, ...added] : added);

        const toUpload = added.filter((attachment) => attachment.status === "uploading");
        if (toUpload.length === 0) {
            return;
        }

        onUploadingChange?.(true);
        try {
            for (const attachment of toUpload) {
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
        } finally {
            onUploadingChange?.(false);
        }
    };

    const handleRemove = (attachmentKey: string) => {
        updateAttachments(attachmentsRef.current.filter((attachment) => attachment.key !== attachmentKey));
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
                <ChooseFilesButton label={buttonLabel} onClick={() => inputRef.current?.click()} />
                {attachments.length > 0 && <FileList attachments={attachments} onRemove={handleRemove} />}
            </div>
        </FieldContainer>
    );
};
