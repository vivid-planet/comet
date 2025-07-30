import { PrettyBytes } from "@comet/admin";
import { FormattedMessage } from "react-intl";

import { formatStrong } from "../../../common/errors/errorMessages";

interface FileSizeErrorProps {
    maxFileSizeInBytes: number;
}

export const FileSizeError = ({ maxFileSizeInBytes }: FileSizeErrorProps) => (
    <FormattedMessage
        id="comet.file.errors.fileSize"
        defaultMessage="<strong>File is too big.</strong> The maximum permitted file size is {maxFileSizeInMegabytes}. Please compress the file and try again."
        values={{
            maxFileSizeInMegabytes: <PrettyBytes unit="megabyte" value={maxFileSizeInBytes} />,
            strong: formatStrong,
        }}
    />
);

interface UnsupportedTypeErrorProps {
    extension: string;
}

export const UnsupportedTypeError = ({ extension }: UnsupportedTypeErrorProps) => (
    <FormattedMessage
        id="comet.file.errors.unsupportedType"
        defaultMessage="<strong>Unsupported file type.</strong> Files with {extension} extension are not permitted. Please use a different file format and try again."
        values={{
            extension,
            strong: formatStrong,
        }}
    />
);

interface MaxResolutionErrorProps {
    maxResolution: number;
}

export const MaxResolutionError = ({ maxResolution }: MaxResolutionErrorProps) => (
    <FormattedMessage
        id="comet.file.errors.maxResolution"
        defaultMessage="<strong>Image resolution is too big.</strong> The maximum permitted resolution is {maxResolution} megapixels. Please reduce the image resolution and try again."
        values={{
            maxResolution,
            strong: formatStrong,
        }}
    />
);

export const MissingFileExtensionError = () => (
    <FormattedMessage
        id="comet.file.errors.missingFileExtension"
        defaultMessage="<strong>File has no extension.</strong> Please add a correct file extension and try again."
        values={{
            strong: formatStrong,
        }}
    />
);

interface FileExtensionTypeMismatchErrorProps {
    extension: string;
    mimetype: string;
}

export const FileExtensionTypeMismatchError = ({ extension, mimetype }: FileExtensionTypeMismatchErrorProps) => (
    <FormattedMessage
        id="comet.file.errors.fileExtensionTypeMismatch"
        defaultMessage="<strong>File extension does not match file type.</strong> File type is {mimetype}, which does not match its {extension} extension. Please use a file extension compatible to the file type."
        values={{
            extension,
            mimetype,
            strong: formatStrong,
        }}
    />
);

export const SvgContainsJavaScriptError = () => (
    <FormattedMessage
        id="comet.file.errors.svgContainsForbiddenContent"
        defaultMessage="<strong>The SVG contains forbidden content.</strong> The SVG must not contain JavaScript or security-relevant tags or attributes."
        values={{
            strong: formatStrong,
        }}
    />
);

export const FilenameTooLongError = () => (
    <FormattedMessage
        id="comet.file.errors.filenameTooLong"
        defaultMessage="<strong>Filename is too long.</strong> The filename can't exceed 255 characters."
        values={{
            strong: formatStrong,
        }}
    />
);
