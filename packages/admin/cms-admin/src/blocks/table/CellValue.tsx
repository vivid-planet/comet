import { RteReadOnly } from "@comet/admin-rte";
import { alpha, styled } from "@mui/material/styles";

import { type RichTextBlockState } from "../createRichTextBlock";

type Props = {
    highlighted: boolean;
    recentlyPasted: boolean;
    value: RichTextBlockState;
};

export const CellValue = ({ highlighted, recentlyPasted, value }: Props) => {
    return (
        <CellValueContainer $highlighted={highlighted} $recentlyPasted={recentlyPasted}>
            <RteContentWrapper>
                <RteContent>
                    <RteReadOnly value={value.editorState} />
                </RteContent>
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

const RteContentWrapper = styled("div")(({ theme }) => ({
    overflow: "hidden",
    height: "100%",
    display: "flex",
    flexDirection: "column",
    paddingTop: theme.spacing(1),
    paddingBottom: theme.spacing(1),

    ".CometAdminRteBlockElement-root:first-child, .MuiTypography-root:first-child": {
        marginTop: 0,
    },

    ".CometAdminRteBlockElement-root:last-child, .MuiTypography-root:last-child": {
        marginBottom: 0,
    },
}));

const RteContent = styled("div")({
    marginTop: "auto",
    marginBottom: "auto",
});
