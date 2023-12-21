import { EllipsisTooltip } from "@comet/admin";
import { Minus, Plus } from "@comet/admin-icons";
import { Button, Paper, Stack, Table, TableBody, TableCell, TableHead, TableRow, Typography } from "@mui/material";
import { Box } from "@mui/system";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { storiesOf } from "@storybook/react";
import * as React from "react";

import { storyRouterDecorator } from "../../story-router.decorator";

const words = ["Cursus", "Ridiculus", "Pharetra", "Ligula", "Sem", "Nullam", "Viverra", "Vestibulum", "Vestibulum", "Vestibulum"];

const getRandomWord = () => {
    return words[Math.floor(Math.random() * words.length)];
};

const getSomeWords = (numberOfWords: number) => {
    return words.slice(0, numberOfWords).join(" ");
};

const DEBUG_SHOW_SINGLE_ELEMENT = true;
const DEBUG_SHOW_SINGLE_ROW_TABLE = true;
const DEBUG_SHOW_TABLE = true;
const DEBUG_SHOW_DATA_GRID = true;

export function Story() {
    const [singleElementWords, setSingleElementWords] = React.useState(words);
    const [singleRowWords, setSingleRowWords] = React.useState(["Lorem", "Ipsum"]);
    const [dataGridRowWords, setDataGridRowWords] = React.useState(["Lorem", "Ipsum"]);

    const gridRows = Array.from({ length: 5 }).map((_, index) => ({
        id: index,
        firstName: getSomeWords(1 * (index + 1)),
        lastName: index === 0 ? dataGridRowWords.join(" ") : getSomeWords(3 * (index + 1)),
    }));

    return (
        <Stack spacing={8} pb={8}>
            {DEBUG_SHOW_SINGLE_ELEMENT && (
                <div>
                    <Typography variant="h3" pb={2}>
                        Single Item
                    </Typography>
                    <Paper elevation={1} sx={{ p: 2 }}>
                        <EllipsisTooltip>{singleElementWords.join(" ")}</EllipsisTooltip>
                    </Paper>
                    <Stack direction="row" alignItems="center" spacing={2} pt={2}>
                        <Typography>Update number of words:</Typography>
                        <Button
                            size="small"
                            variant="contained"
                            color="primary"
                            startIcon={<Minus />}
                            onClick={() => setSingleElementWords((words) => words.slice(0, -1))}
                        >
                            Remove Word
                        </Button>
                        <Button
                            size="small"
                            variant="contained"
                            color="primary"
                            startIcon={<Plus />}
                            onClick={() => setSingleElementWords((words) => [...words, getRandomWord()])}
                        >
                            Add Word
                        </Button>
                    </Stack>
                </div>
            )}
            {DEBUG_SHOW_SINGLE_ROW_TABLE && (
                <div>
                    <Typography variant="h3" pb={2}>
                        Table (Single Row)
                    </Typography>
                    <Table sx={{ tableLayout: "fixed" }}>
                        <TableBody>
                            <TableRow>
                                <TableCell sx={{ width: 120 }}>
                                    <EllipsisTooltip>{getSomeWords(3)}</EllipsisTooltip>
                                </TableCell>
                                <TableCell>
                                    <EllipsisTooltip>{singleRowWords.join(" ")}</EllipsisTooltip>
                                </TableCell>
                                <TableCell>
                                    <EllipsisTooltip>{getSomeWords(10)}.</EllipsisTooltip>
                                </TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                    <Stack direction="row" alignItems="center" spacing={2} pt={2}>
                        <Typography>Update number of words in second column:</Typography>
                        <Button
                            size="small"
                            variant="contained"
                            color="primary"
                            startIcon={<Minus />}
                            onClick={() => setSingleRowWords((words) => words.slice(0, -1))}
                        >
                            Remove Word
                        </Button>
                        <Button
                            size="small"
                            variant="contained"
                            color="primary"
                            startIcon={<Plus />}
                            onClick={() => setSingleRowWords((words) => [...words, getRandomWord()])}
                        >
                            Add Word
                        </Button>
                    </Stack>
                </div>
            )}
            {DEBUG_SHOW_TABLE && (
                <div>
                    <Typography variant="h3" pb={2}>
                        Table
                    </Typography>
                    <Table sx={{ tableLayout: "fixed" }}>
                        <TableHead>
                            <TableRow>
                                <TableCell>Col 1</TableCell>
                                <TableCell>Col 2</TableCell>
                                <TableCell>Col 3</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {Array.from({ length: 5 }).map((_, index) => (
                                <TableRow key={index}>
                                    <TableCell>
                                        <EllipsisTooltip>{getSomeWords(1 * (index + 1))}</EllipsisTooltip>
                                    </TableCell>
                                    <TableCell>
                                        <EllipsisTooltip>{getSomeWords(2 * (index + 1))}</EllipsisTooltip>
                                    </TableCell>
                                    <TableCell>
                                        <EllipsisTooltip>{getSomeWords(3 * (index + 1))}</EllipsisTooltip>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            )}
            {DEBUG_SHOW_DATA_GRID && (
                <Box height={300}>
                    <Typography variant="h3" pb={2}>
                        Data-Grid
                    </Typography>
                    <DataGrid rows={gridRows} columns={gridColumns} disableSelectionOnClick />
                    <Stack direction="row" alignItems="center" spacing={2} pt={2}>
                        <Typography>Update number of words in second column of first row:</Typography>
                        <Button
                            size="small"
                            variant="contained"
                            color="primary"
                            startIcon={<Minus />}
                            onClick={() => setDataGridRowWords((words) => words.slice(0, -1))}
                        >
                            Remove Word
                        </Button>
                        <Button
                            size="small"
                            variant="contained"
                            color="primary"
                            startIcon={<Plus />}
                            onClick={() => setDataGridRowWords((words) => [...words, getRandomWord()])}
                        >
                            Add Word
                        </Button>
                    </Stack>
                </Box>
            )}
        </Stack>
    );
}

const gridColumns: GridColDef[] = [
    {
        field: "firstName",
        headerName: "First name",
        resizable: true,
        width: 250,
        renderCell: ({ row }) => {
            return <EllipsisTooltip>{row.firstName}</EllipsisTooltip>;
        },
    },
    {
        field: "lastName",
        headerName: "Last name",
        flex: 1,
        renderCell: ({ row }) => {
            return <EllipsisTooltip>{row.lastName}</EllipsisTooltip>;
        },
    },
];

storiesOf("@comet/admin/helpers", module)
    .addDecorator(storyRouterDecorator())
    .add("Ellipsis Tooltip", () => <Story />);
