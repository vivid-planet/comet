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

interface IPaginationProps {
    totalCount: number;
    pagingInfo: IPagingInfo;
    rowName?: string | ((count: number) => string);
}

interface IInputProps {
    pagingInfo: IPagingInfo;
    lastInteraction?: "button" | "input";
    setLastInteraction: React.Dispatch<React.SetStateAction<"button" | "input" | undefined>>;
}

export const PageInput: React.FC<IInputProps> = ({
    pagingInfo: { fetchSpecificPage, totalPages, currentPage },
    lastInteraction,
    setLastInteraction,
}) => {
    const validation = (value: number, totalPages: number | null | undefined) => {
        if (totalPages && value >= 1 && value <= totalPages) {
            return true;
        }
        return false;
    };

    const onSubmit = async (values: any) => {
        fetchSpecificPage && fetchSpecificPage(values.page);
    };

    const onChanged = async (e: React.KeyboardEvent<HTMLInputElement> | React.ChangeEvent<HTMLInputElement>) => {
        fetchSpecificPage && fetchSpecificPage(parseInt((e as React.ChangeEvent<HTMLInputElement>).target.value));
    };

    return (
        <sc.PageInputWrapper>
            <Form onSubmit={onSubmit} initialValues={{ page: 1 }}>
                {({ values }) => (
                    <Field name="page" type="number">
                        {({ input, meta }) => {
                            return (
                                <sc.InputField
                                    value={lastInteraction === "button" ? currentPage : input.value}
                                    type="number"
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                        if (Math.abs(parseInt(values.page) - parseInt(e.target.value)) === 1) {
                                            if (validation(parseInt(e.target.value), totalPages)) {
                                                onChanged(e);
                                            }
                                        }
                                        setLastInteraction("input");
                                        input.onChange(e);
                                    }}
                                    onBlur={(e: React.FocusEvent<HTMLInputElement>) => {
                                        if (validation(parseInt(e.target.value), totalPages)) {
                                            onChanged(e);
                                        }
                                    }}
                                    onKeyPress={(e: React.KeyboardEvent<HTMLInputElement>) => {
                                        if (validation(input.value, totalPages)) {
                                            if (e.key === "Enter") {
                                                onChanged(e);
                                            }
                                        }
                                    }}
                                />
                            );
                        }}
                    </Field>
                )}
            </Form>
        </sc.PageInputWrapper>
    );
};

export const TablePagination: React.FunctionComponent<IPaginationProps> = ({ totalCount, pagingInfo, rowName }) => {
    const [lastInteraction, setLastInteraction] = React.useState<"input" | "button" | undefined>();

    if (typeof rowName === "function") {
        rowName = rowName(totalCount);
    }
    return (
        <TableCell colSpan={1000}>
            <Toolbar>
                <Grid container justify="space-between" alignItems="center">
                    <Grid item>
                        <Typography color="textPrimary" variant="body2">
                            {!pagingInfo.hideTotalCount && (
                                <>
                                    {totalCount} {rowName}
                                </>
                            )}
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
                                                    <PageInput
                                                        pagingInfo={pagingInfo}
                                                        lastInteraction={lastInteraction}
                                                        setLastInteraction={setLastInteraction}
                                                    />
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
                                            setLastInteraction("button");
                                        }}
                                        disabled={!pagingInfo.fetchPreviousPage}
                                    >
                                        <FirstPage />
                                    </IconButton>
                                )}
                                <IconButton
                                    disabled={!pagingInfo.fetchPreviousPage}
                                    onClick={() => {
                                        pagingInfo.fetchPreviousPage!();
                                        setLastInteraction("button");
                                    }}
                                >
                                    <KeyboardArrowLeft />
                                </IconButton>
                                <IconButton
                                    disabled={!pagingInfo.fetchNextPage}
                                    onClick={() => {
                                        pagingInfo.fetchNextPage!();
                                        setLastInteraction("button");
                                    }}
                                >
                                    <KeyboardArrowRight />
                                </IconButton>
                                {pagingInfo.fetchLastPage && (
                                    <IconButton
                                        onClick={() => {
                                            pagingInfo.fetchLastPage && pagingInfo.fetchLastPage();
                                            setLastInteraction("button");
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
