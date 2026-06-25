import { SvgUse } from "@src/common/helpers/SvgUse";
import clsx from "clsx";
import { useIntl } from "react-intl";

import styles from "./FileList.module.scss";

export type Attachment = {
    key: string;
    file: File;
    status: "uploading" | "uploaded" | "error";
    id?: string;
    errorMessage?: string;
};

type FileListProps = {
    attachments: Attachment[];
    onRemove: (key: string) => void;
};

export const FileList = ({ attachments, onRemove }: FileListProps) => {
    const intl = useIntl();

    return (
        <ul className={styles.fileList}>
            {attachments.map((attachment) => (
                <li key={attachment.key} className={clsx(styles.fileItem, attachment.status === "error" && styles["fileItem--error"])}>
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
                        onClick={() => onRemove(attachment.key)}
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
    );
};
