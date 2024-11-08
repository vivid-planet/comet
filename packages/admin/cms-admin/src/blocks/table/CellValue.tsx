import { styled } from "@mui/material";
import { ReactNode } from "react";

type Props = {
    highlighted: boolean;
    value: ReactNode;
};

export const CellValue = ({ highlighted, value }: Props) => {
    return (
        <>
            <TextValue $highlighted={highlighted}>{value}</TextValue>
            <CellBackground $highlighted={highlighted} />
        </>
    );
};

const TextValue = styled("div")<{ $highlighted: boolean }>(({ $highlighted }) => ({
    overflow: "hidden",
    whiteSpace: "nowrap",
    textOverflow: "ellipsis",
    fontWeight: $highlighted ? 700 : 400,
}));

const CellBackground = styled("div")<{ $highlighted: boolean }>(({ $highlighted, theme }) => ({
    position: "absolute",
    inset: 0,
    zIndex: -1,
    backgroundColor: $highlighted ? theme.palette.grey[50] : "white",
}));
