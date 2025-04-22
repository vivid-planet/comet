import { Download } from "@comet/admin-icons";
import { FormLabel } from "@mui/material";
import { css } from "@mui/material/styles";
import { FunctionComponent, ReactNode } from "react";
import { FormattedMessage } from "react-intl";

import { createComponentSlot } from "../../helpers/createComponentSlot";

export const ReadOnlyFileField: FunctionComponent<{
    label?: ReactNode;
    value?: File | File[] | null;
    className?: string;
}> = ({ label, value, className }) => {
    const files = Array.isArray(value) ? value : value ? [value] : [];

    return (
        <Wrapper className={className}>
            {label && <Label>{label}</Label>}
            <Box>
                {files.length > 0 ? (
                    <FileList>
                        {files.map((file, index) => {
                            return (
                                <FileItem key={index}>
                                    <FileName>{file.name}</FileName>
                                    {file.size && (
                                        <InnerBox>
                                            <FileSize>
                                                <FormattedMessage
                                                    id="readOnlyField.fileField.size"
                                                    defaultMessage="{size}"
                                                    values={{
                                                        size: `${(file.size / 1024).toFixed(2)} MB`,
                                                    }}
                                                />
                                            </FileSize>
                                            <Download />
                                        </InnerBox>
                                    )}
                                </FileItem>
                            );
                        })}
                    </FileList>
                ) : (
                    <FileItem>
                        <FormattedMessage id="readOnlyField.fileField.noAttachments" defaultMessage="There are no attachments" />
                    </FileItem>
                )}
            </Box>
        </Wrapper>
    );
};

const Wrapper = createComponentSlot("div")({
    componentName: "ReadOnlyFileField",
    slotName: "wrapper",
})(
    css`
        display: flex;
        flex-direction: column;
        gap: 4px;
    `,
);

const Label = createComponentSlot(FormLabel)({
    componentName: "ReadOnlyFileField",
    slotName: "label",
})(
    ({ theme }) => css`
        color: ${theme.palette.grey[900]};
        font-family: ${theme.typography.fontFamily};
        font-size: 16px;
        font-style: normal;
        font-weight: 600;
        line-height: 20px;
        letter-spacing: 0px;
    `,
);

const Box = createComponentSlot("div")({
    componentName: "ReadOnlyFileField",
    slotName: "box",
})(
    () => css`
        display: flex;
        align-items: center;
    `,
);

const FileList = createComponentSlot("div")({
    componentName: "ReadOnlyFileField",
    slotName: "fileList",
})(
    ({ theme }) => css`
        display: flex;
        flex-direction: column;
        gap: 4px;
        width: 100%;
    `,
);

const FileItem = createComponentSlot("div")({
    componentName: "ReadOnlyFileField",
    slotName: "fileItem",
})(
    ({ theme }) => css`
        display: flex;
        align-items: center;
        width: 100%;
        justify-content: space-between;
        min-height: 35px;
        padding: 8px 10px;
        gap: 4px;
        border-radius: 4px;
        border: 1px solid ${theme.palette.grey[100]};
        background: ${theme.palette.grey[50]};
    `,
);

const InnerBox = createComponentSlot("div")({
    componentName: "ReadOnlyFileField",
    slotName: "innerBox",
})(
    () => css`
        display: flex;
        align-items: center;
        gap: 10px;
    `,
);

const FileName = createComponentSlot("span")({
    componentName: "ReadOnlyFileField",
    slotName: "fileName",
})(
    ({ theme }) => css`
        overflow: hidden;
        color: ${theme.palette.grey[900]};
        text-overflow: ellipsis;
        font-family: ${theme.typography.fontFamily};
        font-size: 12px;
        font-style: normal;
        font-weight: 300;
        line-height: 16px;
        letter-spacing: 0px;
    `,
);

const FileSize = createComponentSlot("span")({
    componentName: "ReadOnlyFileField",
    slotName: "fileSize",
})(
    ({ theme }) => css`
        color: ${theme.palette.grey[500]};
        font-family: ${theme.typography.fontFamily};
        font-size: 12px;
        font-style: normal;
        font-weight: 300;
        line-height: 16px;
        letter-spacing: 0px;
        border-radius: 12px;
        background: ${theme.palette.grey[100]};
        padding: 4px 7px;
    `,
);
