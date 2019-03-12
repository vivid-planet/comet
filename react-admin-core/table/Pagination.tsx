import { Grid, Toolbar, Typography } from "@material-ui/core";
import TableCell from "@material-ui/core/TableCell";
import KeyboardArrowLeft from "@material-ui/icons/KeyboardArrowLeft";
import KeyboardArrowRight from "@material-ui/icons/KeyboardArrowRight";
import * as React from "react";
import * as sc from "./Pagination.sc";
import { IPagingActions } from "./pagingStrategy/PagingStrategy";

interface IProps {
    totalCount: number;
    pagingActions: IPagingActions;
}

const Pagination: React.FunctionComponent<IProps> = ({ totalCount, pagingActions }) => (
    <TableCell colSpan={1000}>
        <Toolbar>
            <Grid container justify="space-between" alignItems="center">
                <Grid item>
                    <Typography color="textPrimary" variant="body2">
                        {totalCount}
                    </Typography>
                </Grid>
                <Grid item>
                    <sc.Button onClick={pagingActions.fetchPreviousPage} disabled={!pagingActions.fetchPreviousPage}>
                        <KeyboardArrowLeft color={pagingActions.fetchPreviousPage ? "inherit" : "disabled"} />
                    </sc.Button>
                    <sc.Button onClick={pagingActions.fetchNextPage} disabled={!pagingActions.fetchNextPage}>
                        <KeyboardArrowRight color={pagingActions.fetchNextPage ? "inherit" : "disabled"} />
                    </sc.Button>
                </Grid>
            </Grid>
        </Toolbar>
    </TableCell>
);

export default Pagination;
