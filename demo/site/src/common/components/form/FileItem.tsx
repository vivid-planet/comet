import { SvgUse } from "@src/common/helpers/SvgUse";
import clsx from "clsx";
import { useIntl } from "react-intl";

import styles from "./FileItem.module.scss";
import type { Attachment } from "./useFileUpload";

type FileItemProps = {
    attachment: Attachment;
    onRemove: () => void;
};

export const FileItem = ({ attachment, onRemove }: FileItemProps) => {
    const intl = useIntl();

    return (
        <li className={clsx(styles.fileItem, attachment.status === "error" && styles["fileItem--error"])}>
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
                onClick={onRemove}
                aria-label={intl.formatMessage(
                    { id: "fileUploadField.removeFile", defaultMessage: "Remove {fileName}" },
                    { fileName: attachment.file.name },
                )}
            >
                <SvgUse href="/assets/icons/delete.svg#root" width={16} height={16} />
            </button>
        </li>
    );
};
