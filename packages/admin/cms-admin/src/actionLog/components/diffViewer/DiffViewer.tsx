import { type ThemedComponentBaseProps } from "@comet/admin";
import { ChevronDown } from "@comet/admin-icons";
import { type ComponentsOverrides, type Theme, useTheme } from "@mui/material";
import { useThemeProps } from "@mui/material/styles";
import { type FunctionComponent } from "react";
import ReactDiffViewer, { DiffMethod, type ReactDiffViewerProps } from "react-diff-viewer-continued";
import { FormattedMessage } from "react-intl";

import { CodeFoldMessageContainer, createStyles, Root } from "./DiffViewer.sc";

export type DiffViewerProps = ThemedComponentBaseProps<{
    root: "div";
    codeFoldMessageContainer: "div";
}> &
    ReactDiffViewerProps;

export type DiffViewerClassKey = "root" | "codeFoldMessageContainer";

export const DiffViewer: FunctionComponent<DiffViewerProps> = (inProps) => {
    const {
        slotProps,
        codeFoldMessageRenderer,
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
        <Root sx={sx} className={className} {...slotProps?.root}>
            <ReactDiffViewer
                codeFoldMessageRenderer={
                    codeFoldMessageRenderer
                        ? codeFoldMessageRenderer
                        : (totalFoldedLines) => {
                              return (
                                  <CodeFoldMessageContainer {...slotProps?.codeFoldMessageContainer}>
                                      <ChevronDown />
                                      <FormattedMessage
                                          defaultMessage="Expand {foldedLines} {foldedLines, plural, =0 {lines} one {line} other {lines}}"
                                          id="comet.diffViewer.codeFoldMessage"
                                          values={{ foldedLines: totalFoldedLines }}
                                      />
                                  </CodeFoldMessageContainer>
                              );
                          }
                }
                compareMethod={compareMethod}
                extraLinesSurroundingDiff={extraLinesSurroundingDiff}
                hideLineNumbers
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
