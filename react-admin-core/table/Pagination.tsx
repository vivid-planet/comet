import { Grid, Toolbar, Typography } from "@material-ui/core";
import TableCell from "@material-ui/core/TableCell";
import KeyboardArrowLeft from "@material-ui/icons/KeyboardArrowLeft";
import KeyboardArrowRight from "@material-ui/icons/KeyboardArrowRight";
import * as React from "react";
import * as sc from "./Pagination.sc";

interface IProps {
    hasPrevious: boolean;
    hasNext: boolean;
    total: number;
    onBackClick: () => void;
    onNextClick: () => void;
    rowName?: string | { plural: string; singular: string };
}

const Pagination: React.FunctionComponent<IProps> = ({ total, hasPrevious, hasNext, onBackClick, onNextClick, rowName }) => {
    if (typeof rowName === "object") {
        rowName = total === 1 ? rowName.singular : rowName.plural;
    }
    return (
        <TableCell colSpan={1000}>
            <Toolbar>
                <Grid container justify="space-between" alignItems="center">
                    <Grid item>
                        <Typography color="textPrimary" variant="body2">
                            {total} {rowName}
                        </Typography>
                    </Grid>
                    <Grid item>
                        <sc.Button onClick={onBackClick} disabled={!hasPrevious}>
                            <KeyboardArrowLeft color={hasPrevious ? "inherit" : "disabled"} />
                        </sc.Button>
                        <sc.Button onClick={onNextClick} disabled={!hasNext}>
                            <KeyboardArrowRight color={hasNext ? "inherit" : "disabled"} />
                        </sc.Button>
                    </Grid>
                </Grid>
            </Toolbar>
        </TableCell>
    );
};

export default Pagination;
