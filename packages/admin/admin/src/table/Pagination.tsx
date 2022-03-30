import KeyboardArrowLeft from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRight from "@mui/icons-material/KeyboardArrowRight";
import { Grid, IconButton, Toolbar, Typography } from "@mui/material";
import TableCell from "@mui/material/TableCell";
import * as React from "react";
import { FormattedMessage, FormattedNumber } from "react-intl";

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
                <Grid container justifyContent="space-between" alignItems="center">
                    <Grid item>
                        <Typography color="textPrimary" variant="body2">
                            <FormattedNumber value={totalCount} /> {rowName}
                        </Typography>
                    </Grid>
                    <Grid item>
                        <Grid container alignItems="center" spacing={2}>
                            {pagingInfo.totalPages && pagingInfo.currentPage && (
                                <Grid item>
                                    <Typography color="textSecondary" variant="body2">
                                        <FormattedMessage
                                            id="cometAdmin.table.pagination.pageInfo"
                                            values={{ total: pagingInfo.totalPages, current: pagingInfo.currentPage }}
                                            defaultMessage="Page {current} of {total}"
                                            description="Pagination-info"
                                        />
                                    </Typography>
                                </Grid>
                            )}
                            <Grid item>
                                <IconButton disabled={!pagingInfo.fetchPreviousPage} onClick={() => pagingInfo.fetchPreviousPage!()} size="large">
                                    <KeyboardArrowLeft />
                                </IconButton>
                                <IconButton disabled={!pagingInfo.fetchNextPage} onClick={() => pagingInfo.fetchNextPage!()} size="large">
                                    <KeyboardArrowRight />
                                </IconButton>
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
            </Toolbar>
        </TableCell>
    );
};
