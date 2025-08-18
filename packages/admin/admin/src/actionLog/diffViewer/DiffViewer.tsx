import { type ComponentsOverrides, type Theme, useTheme } from "@mui/material";
import { useThemeProps } from "@mui/material/styles";
import { type FunctionComponent } from "react";
import ReactDiffViewer, { DiffMethod, type ReactDiffViewerProps } from "react-diff-viewer-continued";
import { FormattedMessage } from "react-intl";

import { type ThemedComponentBaseProps } from "../../helpers/ThemedComponentBaseProps";
import { createStyles, type DiffViewerClassKey, Root } from "./DiffViewer.sc";

export type DiffViewerProps = ThemedComponentBaseProps<{
    root: "div";
}> &
    ReactDiffViewerProps;

export { DiffViewerClassKey };

export const DiffViewer: FunctionComponent<DiffViewerProps> = (inProps) => {
    const {
        slotProps,
        codeFoldMessageRenderer = (totalFoldedLines: number) => {
            return (
                <FormattedMessage
                    defaultMessage="{foldedLines} {foldedLines, plural, =0 {Zeilen} one {Zeile} other {Zeilen}} aufklappen"
                    id="comet.diffViewer.codeFoldMessage"
                    values={{ foldedLines: totalFoldedLines }}
                />
            );
        },
        compareMethod = DiffMethod.WORDS_WITH_SPACE,
        extraLinesSurroundingDiff = 0,
        sx,
        className,
        ...restProps
    } = useThemeProps({
        props: inProps,
        name: "CometAdminDiffViewer",
    });
    const theme = useTheme();

    return (
        <Root {...slotProps?.root} sx={sx} className={className}>
            <ReactDiffViewer
                codeFoldMessageRenderer={codeFoldMessageRenderer}
                compareMethod={compareMethod}
                extraLinesSurroundingDiff={extraLinesSurroundingDiff}
                hideLineNumbers
                key={`diff-viewer${restProps.showDiffOnly}`}
                {...restProps}
                styles={createStyles(theme)}
            />
        </Root>
    );
};

declare module "@mui/material/styles" {
    interface ComponentsPropsList {
        CometAdminDiffViewer: DiffViewerProps;
    }

    interface ComponentNameToClassKey {
        CometAdminDiffViewer: DiffViewerClassKey;
    }

    interface Components {
        CometAdminDiffViewer?: {
            defaultProps?: Partial<ComponentsPropsList["CometAdminDiffViewer"]>;
            styleOverrides?: ComponentsOverrides<Theme>["CometAdminDiffViewer"];
        };
    }
}
