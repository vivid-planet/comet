import { Delete, Download, Error, ThreeDotSaving } from "@comet/admin-icons";
import {
    Chip,
    ComponentsOverrides,
    css,
    IconButton as MuiIconButton,
    Skeleton as MuiSkeleton,
    Theme,
    Typography,
    useThemeProps,
} from "@mui/material";
import React from "react";

import { Tooltip } from "../../common/Tooltip";
import { createComponentSlot } from "../../helpers/createComponentSlot";
import { PrettyBytes } from "../../helpers/PrettyBytes";
import { ThemedComponentBaseProps } from "../../helpers/ThemedComponentBaseProps";
import { useElementIsOverflowing } from "../../hooks/useElementIsOverflowing";
import { FileSelectItem } from "./fileSelectItemTypes";

type OwnerState = {
    hasErrorWithDetails: boolean;
    hasErrorWithoutDetails: boolean;
    disabled: boolean;
};

export type FileSelectListItemClassKey =
    | "root"
    | "hasErrorWithDetails"
    | "hasErrorWithoutDetails"
    | "disabled"
    | "skeleton"
    | "content"
    | "fileListItemInfos"
    | "fileName"
    | "fileSize"
    | "errorIconContainer"
    | "errorDetails"
    | "errorDetailsText"
    | "iconButton";

export type FileSelectListItemProps = ThemedComponentBaseProps<{
    root: "div";
    skeleton: typeof MuiSkeleton;
    content: "div";
    fileListItemInfos: "div";
    fileName: typeof Typography;
    fileSize: typeof Chip;
    errorIconContainer: "div";
    errorDetails: "div";
    errorDetailsText: typeof Typography;
    iconButton: typeof MuiIconButton;
}> & {
    file: FileSelectItem;
    disabled?: boolean;
    onClickDownload?: () => void;
    downloadUrl?: string;
    onClickDelete?: () => void;
    iconMapping?: {
        download?: React.ReactNode;
        loading?: React.ReactNode;
        delete?: React.ReactNode;
        error?: React.ReactNode;
    };
};

export const FileSelectListItem = (inProps: FileSelectListItemProps) => {
    const {
        file,
        disabled,
        onClickDownload,
        downloadUrl,
        onClickDelete,
        iconMapping = {},
        slotProps,
        ...restProps
    } = useThemeProps({
        props: inProps,
        name: "CometAdminFileSelectListItem",
    });
    const fileNameRef = React.useRef<HTMLDivElement>(null);
    const fileNameIsOverflowing = useElementIsOverflowing(fileNameRef);

    const {
        download: downloadIcon = <Download />,
        delete: deleteIcon = <Delete />,
        loading: loadingIcon = <ThreeDotSaving />,
        error: errorIcon = <Error fontSize="inherit" />,
    } = iconMapping;

    if ("loading" in file && !file.name) {
        return <Skeleton variant="rounded" height={35} animation="wave" width="100%" sx={{ borderRadius: 2 }} {...slotProps?.skeleton} />;
    }

    const ownerState: OwnerState = {
        hasErrorWithDetails: "error" in file && typeof file.error !== "boolean",
        hasErrorWithoutDetails: "error" in file && typeof file.error === "boolean",
        disabled: Boolean(disabled),
    };

    return (
        <Root ownerState={ownerState} {...slotProps?.root} {...restProps}>
            <Content {...slotProps?.content}>
                <Tooltip title={fileNameIsOverflowing ? file.name : undefined}>
                    <FileName ref={fileNameRef} variant="caption" ownerState={ownerState} {...slotProps?.fileName}>
                        {file.name}
                    </FileName>
                </Tooltip>
                <FileListItemInfos ownerState={ownerState} {...slotProps?.fileListItemInfos}>
                    {"loading" in file ? (
                        loadingIcon
                    ) : (
                        <>
                            {"size" in file && typeof file.size !== "undefined" && (
                                <FileSize label={<PrettyBytes value={file.size} />} size="small" disabled={disabled} {...slotProps?.fileSize} />
                            )}
                            {ownerState.hasErrorWithoutDetails && (
                                <ErrorIconContainer {...slotProps?.errorIconContainer}>{errorIcon}</ErrorIconContainer>
                            )}
                            {(Boolean(onClickDownload) || !!downloadUrl) && (
                                <IconButton
                                    disabled={disabled}
                                    {...(downloadUrl ? { href: downloadUrl, download: true } : { onClick: onClickDownload })}
                                    {...slotProps?.iconButton}
                                >
                                    {downloadIcon}
                                </IconButton>
                            )}
                            {Boolean(onClickDelete) && (
                                <IconButton onClick={onClickDelete} disabled={disabled} {...slotProps?.iconButton}>
                                    {deleteIcon}
                                </IconButton>
                            )}
                        </>
                    )}
                </FileListItemInfos>
            </Content>
            {ownerState.hasErrorWithDetails && "error" in file && (
                <ErrorDetails {...slotProps?.errorDetails}>
                    {errorIcon}
                    <ErrorDetailsText variant="caption" {...slotProps?.errorDetailsText}>
                        {file.error}
                    </ErrorDetailsText>
                </ErrorDetails>
            )}
        </Root>
    );
};

const commonItemSpacingStyles = css`
    &:not(:last-child) {
        margin-bottom: 2px;
    }
`;

const Root = createComponentSlot("div")<FileSelectListItemClassKey, OwnerState>({
    componentName: "FileSelectListItem",
    slotName: "root",
    classesResolver: ({ hasErrorWithDetails, hasErrorWithoutDetails, disabled }) => [
        hasErrorWithDetails && "hasErrorWithDetails",
        hasErrorWithoutDetails && "hasErrorWithoutDetails",
        disabled && "disabled",
    ],
})(
    ({ theme, ownerState }) => css`
        ${commonItemSpacingStyles};
        padding-right: ${theme.spacing(2)};
        padding-left: ${theme.spacing(2)};
        border-radius: 4px;
        background-color: ${theme.palette.grey[50]};
        transition: background-color 200ms;
        width: 100%;
        box-sizing: border-box;

        &:hover {
            background-color: ${theme.palette.grey[100]};

            .CometAdminFileSelectListItem-fileSize {
                background-color: ${theme.palette.grey[200]};
            }

            .CometAdminFileSelectListItem-iconButton {
                color: ${theme.palette.grey[900]};
            }
        }

        ${(ownerState.hasErrorWithDetails || ownerState.hasErrorWithoutDetails) &&
        css`
            outline: 1px dashed ${theme.palette.error.main};
            outline-offset: -1px;
        `}

        ${ownerState.disabled &&
        css`
            pointer-events: none;
        `}
    `,
);

const Skeleton = createComponentSlot(MuiSkeleton)<FileSelectListItemClassKey>({
    componentName: "FileSelectListItem",
    slotName: "skeleton",
})(css`
    ${commonItemSpacingStyles};
`);

const Content = createComponentSlot("div")<FileSelectListItemClassKey>({
    componentName: "FileSelectListItem",
    slotName: "content",
})(
    ({ theme }) => css`
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: ${theme.spacing(1)};
    `,
);

const FileListItemInfos = createComponentSlot("div")<FileSelectListItemClassKey, OwnerState>({
    componentName: "FileSelectListItem",
    slotName: "fileListItemInfos",
})(
    ({ ownerState }) => css`
        display: flex;
        align-items: center;
        justify-content: end;
        margin-left: auto;

        ${ownerState.hasErrorWithDetails &&
        css`
            padding-top: 3.5px;
            margin-bottom: -3.5px;
        `};
    `,
);

const FileName = createComponentSlot(Typography)<FileSelectListItemClassKey, OwnerState>({
    componentName: "FileSelectListItem",
    slotName: "fileName",
})(
    ({ ownerState, theme }) => css`
        text-overflow: ellipsis;
        overflow: hidden;
        white-space: nowrap;
        flex-grow: 1;
        line-height: 19px;
        padding-top: 8px;
        padding-bottom: 8px;

        ${ownerState.hasErrorWithoutDetails &&
        css`
            color: ${theme.palette.error.main};
        `}

        ${ownerState.hasErrorWithDetails &&
        css`
            padding-bottom: 1px;
        `}

        ${ownerState.disabled &&
        css`
            color: ${theme.palette.text.disabled};
        `}
    `,
);

const FileSize = createComponentSlot(Chip)<FileSelectListItemClassKey>({
    componentName: "FileSelectListItem",
    slotName: "fileSize",
})(
    ({ theme }) => css`
        transition: background-color 200ms;

        &:not(:last-child) {
            margin-right: ${theme.spacing(1)};
        }
    `,
);

const ErrorIconContainer = createComponentSlot("div")<FileSelectListItemClassKey>({
    componentName: "FileSelectListItem",
    slotName: "errorIconContainer",
})(
    ({ theme }) => css`
        padding: ${theme.spacing(1)};
        line-height: 0;
        font-size: 16px;
        color: ${theme.palette.error.main};

        &:last-child {
            padding-right: 0;
        }
    `,
);

const ErrorDetails = createComponentSlot("div")<FileSelectListItemClassKey>({
    componentName: "FileSelectListItem",
    slotName: "errorDetails",
})(
    ({ theme }) => css`
        display: flex;
        align-items: center;
        gap: ${theme.spacing(1)};
        color: ${theme.palette.error.main};
        padding-bottom: 8px;
        line-height: 0;
    `,
);

const ErrorDetailsText = createComponentSlot(Typography)<FileSelectListItemClassKey>({
    componentName: "FileSelectListItem",
    slotName: "errorDetailsText",
})();

const IconButton = createComponentSlot(MuiIconButton)<FileSelectListItemClassKey>({
    componentName: "FileSelectListItem",
    slotName: "iconButton",
})(
    ({ theme }) => css`
        padding: ${theme.spacing(1)};
        color: ${theme.palette.grey[300]};
        transition: background-color 200ms;

        &:hover {
            background-color: ${theme.palette.grey[200]};
        }

        &:last-child {
            margin-right: ${theme.spacing(-1)};
        }
    `,
);

declare module "@mui/material/styles" {
    interface ComponentNameToClassKey {
        CometAdminFileSelectListItem: FileSelectListItemClassKey;
    }

    interface ComponentsPropsList {
        CometAdminFileSelectListItem: FileSelectListItemProps;
    }

    interface Components {
        CometAdminFileSelectListItem?: {
            defaultProps?: Partial<ComponentsPropsList["CometAdminFileSelectListItem"]>;
            styleOverrides?: ComponentsOverrides<Theme>["CometAdminFileSelectListItem"];
        };
    }
}
