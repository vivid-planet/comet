import { Error, Select } from "@comet/admin-icons";
import { Box, Button, ComponentsOverrides, css, Theme, Typography, useThemeProps } from "@mui/material";
import React from "react";
import { DropzoneOptions, useDropzone } from "react-dropzone";
import { FormattedMessage } from "react-intl";

import { createComponentSlot } from "../../helpers/createComponentSlot";
import { ThemedComponentBaseProps } from "../../helpers/ThemedComponentBaseProps";

export type FileDropzoneProps = ThemedComponentBaseProps<{
    root: "div";
    dropzone: "div";
    errorIconContainer: "div";
    dropzoneText: typeof Typography;
    selectFileButton: typeof Button;
}> & {
    hasError?: boolean;
    hideDroppableArea?: boolean;
    hideButton?: boolean;
    dropzoneText?: React.ReactNode;
    buttonText?: React.ReactNode;
    iconMapping?: {
        error?: React.ReactNode;
        select?: React.ReactNode;
    };
} & DropzoneOptions;

export type FileDropzoneClassKey =
    | "root"
    | "disabled"
    | "error"
    | "focused"
    | "dropzone"
    | "errorIconContainer"
    | "dropzoneText"
    | "selectFileButton";

type OwnerState = {
    disabled: boolean;
    hasError: boolean;
    focused: boolean;
    dragging: boolean;
};

export const FileDropzone = (inProps: FileDropzoneProps) => {
    const {
        disabled,
        hasError,
        hideDroppableArea,
        hideButton,
        // @ts-expect-error The type should be used from `DropzoneOptions`, however it's missing during lint/build.
        multiple,
        dropzoneText = multiple ? (
            <FormattedMessage id="comet.fileDropzone.dropfiles" defaultMessage="Drop files here to upload" />
        ) : (
            <FormattedMessage id="comet.fileDropzone.dropFile" defaultMessage="Drop file here to upload" />
        ),
        buttonText = multiple ? (
            <FormattedMessage id="comet.fileDropzone.selectfiles" defaultMessage="Select files" />
        ) : (
            <FormattedMessage id="comet.fileDropzone.selectfile" defaultMessage="Select file" />
        ),
        iconMapping = {},
        slotProps,
        sx,
        className,
        ...restDropzoneOptions
    } = useThemeProps({
        props: inProps,
        name: "CometAdminFileDropzone",
    });
    const { error: errorIcon = <Error color="error" />, select: selectIcon = <Select /> } = iconMapping;
    const [focused, setFocused] = React.useState(false);
    const [dragging, setDragging] = React.useState(false);

    const ownerState: OwnerState = {
        disabled: Boolean(disabled),
        hasError: Boolean(hasError),
        focused,
        dragging,
    };

    const dropzoneState = useDropzone({ ...restDropzoneOptions, disabled, multiple });

    return (
        <Box display="contents" onDragOver={() => setDragging(true)} onDragLeave={() => setDragging(false)} onDrop={() => setDragging(false)}>
            <Root
                {...dropzoneState.getRootProps()}
                tabIndex={disabled ? -1 : 0}
                onFocus={() => setFocused(true)}
                onBlur={() => setFocused(false)}
                ownerState={ownerState}
                {...slotProps?.root}
                sx={sx}
                className={className}
            >
                <input {...dropzoneState.getInputProps()} />
                {!hideDroppableArea && (
                    <Dropzone ownerState={ownerState} {...slotProps?.dropzone}>
                        {hasError && <ErrorIconContainer {...slotProps?.errorIconContainer}>{errorIcon}</ErrorIconContainer>}
                        <DropzoneText ownerState={ownerState} variant="body2" {...slotProps?.dropzoneText}>
                            {dropzoneText}
                        </DropzoneText>
                    </Dropzone>
                )}
                {!hideButton && (
                    <SelectFileButton
                        tabIndex={-1}
                        disabled={disabled}
                        variant="contained"
                        color="secondary"
                        startIcon={selectIcon}
                        {...slotProps?.selectFileButton}
                    >
                        {buttonText}
                    </SelectFileButton>
                )}
            </Root>
        </Box>
    );
};

const Root = createComponentSlot("div")<FileDropzoneClassKey, OwnerState>({
    componentName: "FileDropzone",
    slotName: "root",
    classesResolver: ({ disabled, hasError, focused }) => [disabled && "disabled", hasError && "error", focused && "focused"],
})(
    ({ theme, ownerState }) => css`
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        gap: ${theme.spacing(2)};
        width: 100%;

        &:focus {
            outline: none;
        }

        ${ownerState.disabled &&
        css`
            pointer-events: none;
        `}
    `,
);

const Dropzone = createComponentSlot("div")<FileDropzoneClassKey, OwnerState>({
    componentName: "FileDropzone",
    slotName: "dropzone",
})(
    ({ theme, ownerState }) => css`
        position: relative;
        display: flex;
        height: 80px;
        justify-content: center;
        align-items: center;
        align-self: stretch;
        border-radius: 4px;
        border: 1px dashed ${theme.palette.grey[200]};
        background-color: transparent;
        transition: background-color 200ms, border-color 200ms;
        cursor: pointer;

        &:hover {
            border-color: ${theme.palette.grey[400]};
            background-color: ${theme.palette.grey[50]};
        }

        ${ownerState.dragging &&
        css`
            border-color: ${theme.palette.grey[400]};
            background-color: ${theme.palette.grey[50]};
        `}

        ${ownerState.focused &&
        css`
            border-color: ${theme.palette.primary.main};
            background-color: ${theme.palette.grey[50]};
        `}

        ${ownerState.hasError &&
        css`
            border-color: ${theme.palette.error.main};

            &:hover {
                border-color: ${theme.palette.error.dark};
                background-color: ${theme.palette.grey[50]};
            }
        `}


        ${ownerState.disabled &&
        css`
            cursor: default;
            border-color: ${theme.palette.grey[100]};
            background-color: ${theme.palette.grey[50]};
        `}
    `,
);

const ErrorIconContainer = createComponentSlot("div")<FileDropzoneClassKey>({
    componentName: "FileDropzone",
    slotName: "errorIconContainer",
})(
    ({ theme }) => css`
        position: absolute;
        top: 0;
        right: 0;
        padding: 10px;
        color: ${theme.palette.error.main};
    `,
);

const DropzoneText = createComponentSlot(Typography)<FileDropzoneClassKey, OwnerState>({
    componentName: "FileDropzone",
    slotName: "dropzoneText",
})(
    ({ theme, ownerState }) => css`
        padding: ${theme.spacing(6, 2)};
        color: ${theme.palette.grey[400]};
        text-align: center;

        ${ownerState.disabled &&
        css`
            color: ${theme.palette.grey[200]};
        `}
    `,
);

const SelectFileButton = createComponentSlot(Button)<FileDropzoneClassKey>({
    componentName: "FileDropzone",
    slotName: "selectFileButton",
})(
    ({ theme }) => css`
        background-color: ${theme.palette.grey[800]};
        color: ${theme.palette.common.white};

        &:hover {
            background-color: black;
            color: ${theme.palette.common.white};
        }

        &:disabled {
            background-color: ${theme.palette.grey[800]};
            color: ${theme.palette.common.white};
            opacity: 0.2;
        }
    `,
);

declare module "@mui/material/styles" {
    interface ComponentNameToClassKey {
        CometAdminFileDropzone: FileDropzoneClassKey;
    }

    interface ComponentsPropsList {
        CometAdminFileDropzone: FileDropzoneProps;
    }

    interface Components {
        CometAdminFileDropzone?: {
            defaultProps?: Partial<ComponentsPropsList["CometAdminFileDropzone"]>;
            styleOverrides?: ComponentsOverrides<Theme>["CometAdminFileDropzone"];
        };
    }
}
