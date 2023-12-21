import { EllipsisTooltip } from "@comet/admin";
import { Table, TableBody, TableCell, TableHead, TableRow } from "@mui/material";
import { storiesOf } from "@storybook/react";
import * as React from "react";

storiesOf("stories/components/EllipsisTooltip", module).add("Table", () => {
    const words = ["Cursus", "Ridiculus", "Pharetra", "Ligula", "Sem", "Nullam", "Viverra", "Vestibulum", "Vestibulum", "Vestibulum"];

    const getWordsForCell = (cellNumber: number, rowIndex: number) => {
        return words.slice(0, cellNumber * (rowIndex + 1)).join(" ");
    };

    return (
        <Table sx={{ tableLayout: "fixed" }}>
            <TableHead>
                <TableRow>
                    <TableCell>Column 1</TableCell>
                    <TableCell>Column 2</TableCell>
                    <TableCell>Column 3</TableCell>
                </TableRow>
            </TableHead>
            <TableBody>
                {Array.from({ length: 5 }).map((_, rowIndex) => (
                    <TableRow key={rowIndex}>
                        <TableCell>
                            <EllipsisTooltip>{getWordsForCell(1, rowIndex)}</EllipsisTooltip>
                        </TableCell>
                        <TableCell>
                            <EllipsisTooltip>{getWordsForCell(2, rowIndex)}</EllipsisTooltip>
                        </TableCell>
                        <TableCell>
                            <EllipsisTooltip>{getWordsForCell(3, rowIndex)}.</EllipsisTooltip>
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    );
});
