import { Grid, IconButton, Toolbar, Typography } from "@material-ui/core";
import TableCell from "@material-ui/core/TableCell";
import { FirstPage, LastPage } from "@material-ui/icons";
import KeyboardArrowLeft from "@material-ui/icons/KeyboardArrowLeft";
import KeyboardArrowRight from "@material-ui/icons/KeyboardArrowRight";
import { Field } from "@vivid-planet/react-admin-form";
import * as React from "react";
import { Form } from "react-final-form";
import * as sc from "./Pagination.sc";
import { IPagingInfo } from "./paging/IPagingInfo";

interface IProps {
    totalCount: number;
    pagingInfo: IPagingInfo;
    rowName?: string | ((count: number) => string);
}

export const PageInput: React.FC<{ pagingInfo: IPagingInfo }> = ({ pagingInfo: { fetchSpecificPage, totalPages } }) => {
    const validate = (value: number): string | undefined | null => (value >= 1 && value <= totalPages! ? undefined : "Required");

    const onSubmit = async (values: any) => {
        fetchSpecificPage && fetchSpecificPage(values.page);
    };

    const onChanged = async (e: React.ChangeEvent<HTMLInputElement>) => {
        fetchSpecificPage && fetchSpecificPage(parseInt(e.target.value));
    };

    return (
        <sc.PageInputWrapper>
            <Form onSubmit={onSubmit} initialValues={{ page: 1 }}>
                {({ values }) => (
                    <Field name="page" type="number" validate={validate}>
                        {({ input, meta }) => (
                            <sc.InputField
                                type="number"
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                    if (Math.abs(values.page - parseInt(e.target.value)) === 1) {
                                        onChanged(e);
                                    }
                                    input.onChange(e);
                                }}
                                onBlur={onChanged}
                                onKeyPress={(e: React.KeyboardEvent<HTMLInputElement>) => {
                                    if (e.key === "Enter") {
                                        onChanged(e);
                                    }
                                }}
                            />
                        )}
                    </Field>
                )}
            </Form>
        </sc.PageInputWrapper>
    );
};

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
                        <Grid container alignItems="center" spacing={2}>
                            {pagingInfo.totalPages && pagingInfo.currentPage && (
                                <Grid item>
                                    <Typography color="textSecondary" variant="body2">
                                        {pagingInfo.totalPages && pagingInfo.currentPage && (
                                            <>
                                                Seite{" "}
                                                {pagingInfo && pagingInfo.fetchSpecificPage ? (
                                                    <PageInput pagingInfo={pagingInfo} />
                                                ) : (
                                                    pagingInfo.currentPage
                                                )}{" "}
                                                von {pagingInfo.totalPages}
                                            </>
                                        )}
                                    </Typography>
                                </Grid>
                            )}
                            <Grid item>
                                {pagingInfo.fetchFirstPage && (
                                    <IconButton
                                        onClick={() => {
                                            pagingInfo.fetchFirstPage && pagingInfo.fetchFirstPage();
                                        }}
                                        disabled={!pagingInfo.fetchPreviousPage}
                                    >
                                        <FirstPage />
                                    </IconButton>
                                )}
                                <IconButton disabled={!pagingInfo.fetchPreviousPage} onClick={() => pagingInfo.fetchPreviousPage!()}>
                                    <KeyboardArrowLeft />
                                </IconButton>
                                <IconButton disabled={!pagingInfo.fetchNextPage} onClick={() => pagingInfo.fetchNextPage!()}>
                                    <KeyboardArrowRight />
                                </IconButton>
                                {pagingInfo.fetchLastPage && (
                                    <IconButton
                                        onClick={() => {
                                            pagingInfo.fetchLastPage && pagingInfo.fetchLastPage();
                                        }}
                                        disabled={!pagingInfo.fetchNextPage}
                                    >
                                        <LastPage />
                                    </IconButton>
                                )}
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
            </Toolbar>
        </TableCell>
    );
};
