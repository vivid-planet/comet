import { RteReadOnly } from "@comet/admin-rte";
import { alpha, styled } from "@mui/material/styles";
import { useLayoutEffect, useRef, useState } from "react";

import { type RichTextBlockState } from "../createRichTextBlock";

type Props = {
    highlighted: boolean;
    recentlyPasted: boolean;
    value: RichTextBlockState;
};

export const CellValue = ({ highlighted, recentlyPasted, value }: Props) => {
    const rteContentWrapperRef = useRef<HTMLDivElement>(null);
    const rteContentRef = useRef<HTMLDivElement>(null);
    const [valueOverflowsCell, setValueOverflowsCell] = useState(false);

    useLayoutEffect(() => {
        const minimumSpaceAroundCellContent = 10;
        const rteContent = rteContentRef.current;
        const rteContentWrapper = rteContentWrapperRef.current;

        if (!rteContent || !rteContentWrapper) return;

        const updateValueOverflowsCell = () => {
            setValueOverflowsCell(rteContent.offsetHeight > rteContentWrapper.clientHeight - minimumSpaceAroundCellContent);
        };

        updateValueOverflowsCell();
        const observer = new ResizeObserver(updateValueOverflowsCell);
        observer.observe(rteContent);
        return () => observer.disconnect();
    }, [value.editorState]);

    return (
        <CellValueContainer $highlighted={highlighted} $recentlyPasted={recentlyPasted}>
            <RteContentWrapper ref={rteContentWrapperRef} $valueOverflowsCell={valueOverflowsCell}>
                <div ref={rteContentRef}>
                    <RteReadOnly value={value.editorState} />
                </div>
            </RteContentWrapper>
        </CellValueContainer>
    );
};

const CellValueContainer = styled("div")<{ $highlighted: boolean; $recentlyPasted: boolean }>(({ $highlighted, $recentlyPasted, theme }) => ({
    position: "relative",
    backgroundColor: $highlighted ? theme.palette.grey[50] : "transparent",
    marginLeft: theme.spacing(-2),
    marginRight: theme.spacing(-2),
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2),
    height: "100%",

    "&:after": {
        content: "''",
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        backgroundColor: alpha(theme.palette.primary.dark, 0.4),
        opacity: $recentlyPasted ? 1 : 0,
        transition: "opacity 1s ease-in-out",
        pointerEvents: "none",
    },
}));

const RteContentWrapper = styled("div")<{ $valueOverflowsCell: boolean }>(({ $valueOverflowsCell, theme }) => ({
    overflow: "hidden",
    height: "100%",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",

    ...($valueOverflowsCell && {
        justifyContent: "flex-start",
        paddingTop: theme.spacing(1),
    }),

    ".CometAdminRteBlockElement-root:first-child, .MuiTypography-root:first-child": {
        marginTop: 0,
    },

    ".CometAdminRteBlockElement-root:last-child, .MuiTypography-root:last-child": {
        marginBottom: 0,
    },
}));
