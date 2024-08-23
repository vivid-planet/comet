import { Box } from "@mui/material";
import React from "react";

type Props = {
    highlighted: boolean;
    value: React.ReactNode;
};

export const CellValue = ({ highlighted, value }: Props) => {
    return (
        <>
            <Box sx={{ overflow: "hidden", whiteSpace: "nowrap", textOverflow: "ellipsis", fontWeight: highlighted ? 700 : 400 }}>{value}</Box>
            <Box
                sx={(theme) => ({
                    position: "absolute",
                    zIndex: -1,
                    top: 0,
                    right: 0,
                    bottom: 0,
                    left: 0,
                    backgroundColor: highlighted ? theme.palette.grey[50] : "white",
                })}
            />
        </>
    );
};
