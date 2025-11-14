import { styled } from "@mui/material/styles";
import { type ReactNode } from "react";

type Props = {
    highlighted: boolean;
    value: ReactNode;
};

export const CellValue = ({ highlighted, value }: Props) => {
    return (
        <CellValueContainer $highlighted={highlighted}>
            <TextValue $highlighted={highlighted}>{value}</TextValue>
        </CellValueContainer>
    );
};

const CellValueContainer = styled("div")<{ $highlighted: boolean }>(({ $highlighted, theme }) => ({
    backgroundColor: $highlighted ? theme.palette.grey[50] : "transparent",
    marginLeft: theme.spacing(-2),
    marginRight: theme.spacing(-2),
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2),
}));

const TextValue = styled("div")<{ $highlighted: boolean }>(({ $highlighted }) => ({
    overflow: "hidden",
    whiteSpace: "nowrap",
    textOverflow: "ellipsis",
    fontWeight: $highlighted ? 700 : 400,
}));
