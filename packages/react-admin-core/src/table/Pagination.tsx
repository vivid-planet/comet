import { Grid, Toolbar, Typography } from "@material-ui/core";
import TableCell from "@material-ui/core/TableCell";
import KeyboardArrowLeft from "@material-ui/icons/KeyboardArrowLeft";
import KeyboardArrowRight from "@material-ui/icons/KeyboardArrowRight";
import * as React from "react";
import * as sc from "./Pagination.sc";
import { IPagingInfo } from "./paging/IPagingInfo";

interface IProps {
    totalCount: number;
    pagingInfo: IPagingInfo;
    rowName?: string | ((count: number) => string);
}

export const TablePagination: React.FunctionComponent<IProps> = ({ totalCount, pagingInfo, rowName }) => {
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
                        {pagingInfo.totalPages && pagingInfo.currentPage && (
                            <>
                                Seite {pagingInfo.currentPage} von {pagingInfo.totalPages}
                            </>
                        )}
                        <sc.Button
                            onClick={() => {
                                pagingInfo.fetchPreviousPage!();
                            }}
                            disabled={!pagingInfo.fetchPreviousPage}
                        >
                            <KeyboardArrowLeft color={pagingInfo.fetchPreviousPage ? "inherit" : "disabled"} />
                        </sc.Button>
                        <sc.Button
                            onClick={() => {
                                pagingInfo.fetchNextPage!();
                            }}
                            disabled={!pagingInfo.fetchNextPage}
                        >
                            <KeyboardArrowRight color={pagingInfo.fetchNextPage ? "inherit" : "disabled"} />
                        </sc.Button>
                    </Grid>
                </Grid>
            </Toolbar>
        </TableCell>
    );
};
