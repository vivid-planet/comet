import { Grid, IconButton, makeStyles, MenuItem, Select, Toolbar, Typography, Box } from "@material-ui/core";
import TableCell from "@material-ui/core/TableCell";
import KeyboardArrowLeft from "@material-ui/icons/KeyboardArrowLeft";
import KeyboardArrowRight from "@material-ui/icons/KeyboardArrowRight";
import * as React from "react";
import { IPagingInfo } from "./paging/IPagingInfo";

interface IProps {
    totalCount: number;
    pagingInfo: IPagingInfo;
    rowName?: string | ((count: number) => string);
}

const useStyles = makeStyles(() => ({
    select: {
        fontSize: 14,
    },
}));

const range = (start: number, end: number) => Array.from({ length: end - start + 1 }, (_, index) => start + index);

export const TablePagination: React.FunctionComponent<IProps> = ({ totalCount, pagingInfo, rowName }) => {
    const classes = useStyles();
    if (typeof rowName === "function") {
        rowName = rowName(totalCount);
    }

    return (
        <TableCell colSpan={1000}>
            <Toolbar>
                <Grid container justify="space-between" alignItems="center">
                    <Grid item>
                        <Typography color="textPrimary" variant="body2">
                            {totalCount} {rowName}
                        </Typography>
                    </Grid>
                    <Grid item>
                        <Grid container spacing={1} alignItems="center">
                            {pagingInfo.totalPages && pagingInfo.currentPage && (
                                <Grid item>
                                    Seite {pagingInfo.currentPage} von {pagingInfo.totalPages}
                                </Grid>
                            )}
                            <Grid item>
                                <IconButton
                                    onClick={() => {
                                        pagingInfo.fetchPreviousPage!();
                                    }}
                                    disabled={!pagingInfo.fetchPreviousPage}
                                >
                                    <KeyboardArrowLeft />
                                </IconButton>
                            </Grid>
                            <Grid item>
                                <IconButton
                                    onClick={() => {
                                        pagingInfo.fetchNextPage!();
                                    }}
                                    disabled={!pagingInfo.fetchNextPage}
                                >
                                    <KeyboardArrowRight />
                                </IconButton>
                            </Grid>
                            {pagingInfo.fetchPage && pagingInfo.currentPage && pagingInfo.totalPages && (
                                <>
                                    <Grid item>Gehe zu</Grid>
                                    <Grid item>
                                        <Select
                                            value={pagingInfo.currentPage}
                                            onChange={event => {
                                                pagingInfo.fetchPage!(Number(event.target.value));
                                            }}
                                            className={classes.select}
                                        >
                                            {range(1, pagingInfo.totalPages).map(page => (
                                                <MenuItem key={page} value={page}>
                                                    {page}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                    </Grid>
                                </>
                            )}
                        </Grid>
                    </Grid>
                </Grid>
            </Toolbar>
        </TableCell>
    );
};
