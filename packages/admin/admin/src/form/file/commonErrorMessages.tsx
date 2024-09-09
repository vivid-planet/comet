import { FormattedMessage } from "react-intl";

export const commonErrorMessages = {
    invalidFileType: <FormattedMessage id="comet.form.file.invalidFileType" defaultMessage="File type is not allowed." />,
    fileTooLarge: <FormattedMessage id="comet.form.file.fileTooLarge" defaultMessage="File is too large." />,
    tooManyFiles: (maxFiles: number) => (
        <FormattedMessage
            id="comet.form.file.tooManyFiles"
            defaultMessage="Upload was canceled. You can only upload a maximum of {maxFiles} {maxFiles, plural, one {file} other {files}}, please reduce your selection."
            values={{ maxFiles }}
        />
    ),
};
