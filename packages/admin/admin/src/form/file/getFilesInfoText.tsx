import { FormattedMessage } from "react-intl";

import { PrettyBytes } from "../../helpers/PrettyBytes";
import { type FileSelectProps } from "./FileSelect";

export const getFilesInfoText = (maxFiles: FileSelectProps["maxFiles"], maxFileSize: FileSelectProps["maxFileSize"]) => {
    if (typeof maxFiles === "number" && typeof maxFileSize === "number") {
        if (maxFiles === 1) {
            return (
                <FormattedMessage
                    id="comet.fileSelect.singleFileMaximumSize"
                    defaultMessage="Maximum 1 file, {maxFileSize}."
                    values={{
                        maxFileSize: <PrettyBytes value={maxFileSize} />,
                    }}
                />
            );
        }

        return (
            <FormattedMessage
                id="comet.fileSelect.multipleFilesMaximumSize"
                defaultMessage="Maximum {maxFiles} files, {maxFileSize} per file."
                values={{
                    maxFileSize: <PrettyBytes value={maxFileSize} />,
                    maxFiles,
                }}
            />
        );
    }

    if (typeof maxFiles === "number") {
        return (
            <FormattedMessage
                id="comet.fileSelect.maximumFiles"
                defaultMessage="Maximum {maxFiles, plural, one {# file} other {# files}}."
                values={{
                    maxFiles,
                }}
            />
        );
    }

    if (typeof maxFileSize === "number") {
        return (
            <FormattedMessage
                id="comet.fileSelect.maximumSize"
                defaultMessage="Maximum {maxFileSize} per file."
                values={{
                    maxFileSize: <PrettyBytes value={maxFileSize} />,
                }}
            />
        );
    }

    return null;
};
