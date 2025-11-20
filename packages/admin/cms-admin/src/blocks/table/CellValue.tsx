import { alpha, styled } from "@mui/material/styles";
import { type ReactNode } from "react";

type Props = {
    highlighted: boolean;
    recentlyPasted: boolean;
    value: ReactNode;
};

export const CellValue = ({ highlighted, recentlyPasted, value }: Props) => {
    return (
        <CellValueContainer $highlighted={highlighted} $recentlyPasted={recentlyPasted} data-testid="table-block-grid-cell-value">
            <TextValue $highlighted={highlighted}>{value}</TextValue>
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

const TextValue = styled("div")<{ $highlighted: boolean }>(({ $highlighted }) => ({
    overflow: "hidden",
    whiteSpace: "nowrap",
    textOverflow: "ellipsis",
    fontWeight: $highlighted ? 700 : 400,
}));
