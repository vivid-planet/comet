import { useTheme } from "@mui/material";
import { type FunctionComponent } from "react";
import ReactDiffViewer, { DiffMethod, type ReactDiffViewerProps } from "react-diff-viewer-continued";
import { FormattedMessage } from "react-intl";

import { createStyles, Root } from "./DiffViewer.styles";

type DiffViewerProps = ReactDiffViewerProps;

export const DiffViewer: FunctionComponent<DiffViewerProps> = ({ ...restProps }) => {
    const theme = useTheme();

    return (
        <Root>
            <ReactDiffViewer
                codeFoldMessageRenderer={(totalFoldedLines) => {
                    return (
                        <FormattedMessage
                            defaultMessage="{foldedLines} {foldedLines, plural, =0 {Zeilen} one {Zeile} other {Zeilen}} aufklappen"
                            id="comet.table.localChangesToolbar.unsavedItems"
                            values={{ foldedLines: totalFoldedLines }}
                        />
                    );
                }}
                compareMethod={DiffMethod.WORDS_WITH_SPACE}
                extraLinesSurroundingDiff={0}
                hideLineNumbers
                key={`diff-viewer${restProps.showDiffOnly}`}
                {...restProps}
                styles={createStyles(theme)}
            />
        </Root>
    );
};
