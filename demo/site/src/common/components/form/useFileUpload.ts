import { getRecaptchaToken } from "@src/util/recaptcha/getRecaptchaToken";
import { useSiteConfig } from "@src/util/SiteConfigProvider";
import { useParams } from "next/navigation";
import { type ChangeEvent, useRef, useState } from "react";
import { useIntl } from "react-intl";

export type Attachment = {
    key: string;
    file: File;
    status: "uploading" | "uploaded" | "error";
    id?: string;
    errorMessage?: string;
};

const getUploadedIds = (attachments: Attachment[]): string[] =>
    attachments.flatMap((attachment) => (attachment.status === "uploaded" && attachment.id ? [attachment.id] : []));

type UseFileUploadOptions = {
    multiple: boolean;
    validateFile?: (file: File) => string | undefined;
    onUploadingChange?: (isUploading: boolean) => void;
    onUploadedIdsChange: (uploadedIds: string[]) => void;
};

export const useFileUpload = ({ multiple, validateFile, onUploadingChange, onUploadedIdsChange }: UseFileUploadOptions) => {
    const intl = useIntl();

    const [attachments, setAttachments] = useState<Attachment[]>([]);
    const attachmentsRef = useRef<Attachment[]>(attachments);
    attachmentsRef.current = attachments;

    const { recaptchaSiteKey } = useSiteConfig();
    const params = useParams<{ language: string }>();
    const language = params?.language;

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

    const updateAttachments = (next: Attachment[]) => {
        attachmentsRef.current = next;
        setAttachments(next);
        onUploadedIdsChange(getUploadedIds(next));
    };

    const patchAttachment = (attachmentKey: string, patch: Partial<Attachment>) => {
        updateAttachments(attachmentsRef.current.map((attachment) => (attachment.key === attachmentKey ? { ...attachment, ...patch } : attachment)));
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

    const hasErrors = () => attachmentsRef.current.some((attachment) => attachment.status === "error");

    return { attachments, handleSelect, handleRemove, hasErrors };
};
