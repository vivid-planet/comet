import { useThemeProps } from "@mui/material/styles";
import * as React from "react";
import { DropzoneOptions } from "react-dropzone";
import { FieldRenderProps } from "react-final-form";
import { FormattedMessage } from "react-intl";

import { FileSelect, FileSelectProps } from "./file/FileSelect";
import { ErrorFileSelectItem, ValidFileSelectItem } from "./file/fileSelectItemTypes";

export interface FinalFormFileSelectProps
    extends FieldRenderProps<File | File[], HTMLInputElement>,
        Omit<FileSelectProps, "files" | "onDrop" | "onRemove"> {}

export function FinalFormFileSelect(inProps: FinalFormFileSelectProps) {
    const {
        disabled,
        maxSize,
        maxFiles,
        input: { onChange, value: fieldValue },
        meta,
        ...restProps
    } = useThemeProps({
        props: inProps,
        name: "CometAdminFinalFormFileSelect",
    });

    const [tooManyFilesSelected, setTooManyFilesSelected] = React.useState(false);
    const [rejectedFiles, setRejectedFiles] = React.useState<ErrorFileSelectItem[]>([]);
    const singleFile = maxFiles === 1;

    const onDrop = React.useCallback<NonNullable<DropzoneOptions["onDrop"]>>(
        (acceptedFiles, fileRejections) => {
            setRejectedFiles(
                fileRejections.map((rejectedFile) => {
                    const failedFile: ErrorFileSelectItem = {
                        name: rejectedFile.file.name,
                        error: true,
                    };

                    if (rejectedFile.errors.some((error) => error.code === "file-too-large")) {
                        failedFile.error = <FormattedMessage id="comet.finalFormFileSelect.fileTooLarge" defaultMessage="File is too large." />;
                    }

                    if (rejectedFile.errors.some((error) => error.code === "file-invalid-type")) {
                        failedFile.error = (
                            <FormattedMessage id="comet.finalFormFileSelect.fileInvalidType" defaultMessage="File type is not allowed." />
                        );
                    }

                    return failedFile;
                }),
            );

            const tooManyFilesWereDropped = fileRejections.some((rejectedFile) =>
                rejectedFile.errors.some((error) => error.code === "too-many-files"),
            );
            setTooManyFilesSelected(tooManyFilesWereDropped);

            if (singleFile) {
                onChange(acceptedFiles[0]);
            } else {
                if (Array.isArray(fieldValue)) {
                    if (!maxFiles || (maxFiles && fieldValue.length < maxFiles && fieldValue.length + acceptedFiles.length <= maxFiles)) {
                        onChange([...fieldValue, ...acceptedFiles]);
                    }
                } else {
                    onChange([...acceptedFiles]);
                }
            }
        },
        [fieldValue, singleFile, onChange, maxFiles],
    );

    const acceptedFiles: ValidFileSelectItem[] = [];

    if (Array.isArray(fieldValue)) {
        fieldValue.forEach(({ name, size }) => {
            acceptedFiles.push({ name, size });
        });
    } else if (fieldValue.name !== undefined) {
        acceptedFiles.push({ name: fieldValue.name, size: fieldValue.size });
    }

    return (
        <FileSelect
            files={[...acceptedFiles, ...rejectedFiles]}
            onDrop={onDrop}
            onRemove={(fileToRemove) => {
                const newFiles = Array.isArray(fieldValue) ? fieldValue.filter((file) => file.name !== fileToRemove.name) : undefined;
                onChange(newFiles);
                setTooManyFilesSelected(false);
                setRejectedFiles(rejectedFiles.filter((file) => file.name !== fileToRemove.name));
            }}
            disabled={disabled}
            maxFiles={maxFiles}
            maxFileSize={maxSize}
            error={
                tooManyFilesSelected ? (
                    <FormattedMessage
                        id="comet.finalFormFileSelect.maximumFilesAmount"
                        defaultMessage="Upload was canceled. You can only upload a maximum of {maxFiles} {maxFiles, plural, one {file} other {files}}, please reduce your selection."
                        values={{ maxFiles }}
                    />
                ) : undefined
            }
            {...restProps}
        />
    );
}
