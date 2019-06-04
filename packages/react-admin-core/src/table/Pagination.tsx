import { Grid, Toolbar, Typography } from "@material-ui/core";
import TableCell from "@material-ui/core/TableCell";
import KeyboardArrowLeft from "@material-ui/icons/KeyboardArrowLeft";
import KeyboardArrowRight from "@material-ui/icons/KeyboardArrowRight";
import * as React from "react";
import * as sc from "./Pagination.sc";
import { IPagingInfo } from "./pagingStrategy/PagingStrategy";
import { TableQueryContext } from "./TableQueryContext";

interface IProps {
    totalCount: number;
    currentPage?: number;
    pagingInfo: IPagingInfo;
    rowName?: string | ((count: number) => string);
}

export const TablePagination: React.FunctionComponent<IProps> = ({ totalCount, currentPage, pagingInfo, rowName }) => {
    const tableQueryContext = React.useContext(TableQueryContext);
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
                        {pagingInfo.totalPages && (
                            <>
                                Seite {currentPage} von {pagingInfo.totalPages}
                            </>
                        )}
                        <sc.Button
                            onClick={() => {
                                if (tableQueryContext) pagingInfo.fetchPreviousPage!(tableQueryContext.api);
                            }}
                            disabled={!pagingInfo.fetchPreviousPage}
                        >
                            <KeyboardArrowLeft color={pagingInfo.fetchPreviousPage ? "inherit" : "disabled"} />
                        </sc.Button>
                        <sc.Button
                            onClick={() => {
                                if (tableQueryContext) pagingInfo.fetchNextPage!(tableQueryContext.api);
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
