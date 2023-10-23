import { ApolloError, useApolloClient } from "@apollo/client";
import { OperationVariables } from "@apollo/client/core";
import { ApolloQueryResult } from "@apollo/client/core/types";
import { Loading } from "@comet/admin";
import { ArrowRight, OpenNewTab } from "@comet/admin-icons";
import { Chip, IconButton, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";
import { LabelDisplayedRowsArgs } from "@mui/material/TablePagination/TablePagination";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import * as React from "react";
import { FormattedMessage, useIntl } from "react-intl";
import { useHistory } from "react-router";

import { useContentScope } from "../contentScope/Provider";
import { GQLDependency } from "../graphql.generated";
import { useDependenciesConfig } from "./DependenciesConfig";
import { DependencyInterface } from "./types";

type DependencyItem = Pick<GQLDependency, "name" | "secondaryInformation" | "rootColumnName" | "jsonPath"> & {
    id: string;
    graphqlObjectType: string;
};

interface DependencyListProps {
    loading: boolean;
    error: ApolloError | undefined;
    refetch: (variables?: Partial<OperationVariables>) => Promise<ApolloQueryResult<unknown>>;
    dependencyItems: Array<DependencyItem> | undefined;
}

const pageSize = 2;

export const DependencyList = ({ loading, error, refetch, dependencyItems }: DependencyListProps) => {
    const intl = useIntl();
    const entityDependencyMap = useDependenciesConfig();
    const contentScope = useContentScope();
    const apolloClient = useApolloClient();
    const history = useHistory();

    const columns: GridColDef<DependencyItem>[] = [
        {
            field: "nameInfo",
            headerName: intl.formatMessage({ id: "comet.dependencies.dataGrid.nameAndInfo", defaultMessage: "Name/Info" }),
            sortable: false,
            flex: 1,
            renderCell: ({ row }) => {
                return (
                    <NameInfoWrapper>
                        <NameInfoTypography color="text.primary">{row.name}</NameInfoTypography>
                        <NameInfoTypography color="text.secondary">{row.secondaryInformation}</NameInfoTypography>
                    </NameInfoWrapper>
                );
            },
        },
        {
            field: "type",
            headerName: intl.formatMessage({ id: "comet.dependencies.dataGrid.type", defaultMessage: "Type" }),
            sortable: false,
            renderCell: ({ row }) => <StyledChip label={entityDependencyMap[row.graphqlObjectType]?.displayName ?? row.graphqlObjectType} />,
        },
        {
            field: "actions",
            headerName: "",
            sortable: false,
            renderCell: ({ row }) => {
                const dependencyObject = entityDependencyMap[row.graphqlObjectType] as DependencyInterface | undefined;

                if (dependencyObject === undefined) {
                    console.warn(
                        `Cannot log URL because no implementation of DependencyInterface for ${row.graphqlObjectType} was provided via the DependenciesConfig`,
                    );
                    return <FormattedMessage id="comet.dependencies.dataGrid.cannotLoadUrl" defaultMessage="Cannot determine URL" />;
                }

                const loadUrl = () =>
                    dependencyObject.getUrl({
                        rootColumnName: row.rootColumnName,
                        jsonPath: row.jsonPath,
                        contentScopeUrl: contentScope.match.url,
                        apolloClient,
                        id: row.id,
                    });

                return (
                    <div style={{ display: "flex" }}>
                        <IconButton
                            onClick={async () => {
                                const url = await loadUrl();
                                window.open(url, "_blank");
                            }}
                        >
                            <OpenNewTab />
                        </IconButton>
                        <IconButton
                            onClick={async () => {
                                const url = await loadUrl();

                                history.push(url);
                            }}
                        >
                            <ArrowRight />
                        </IconButton>
                    </div>
                );
            },
        },
    ];

    if (loading) {
        return <Loading behavior="fillParent" />;
    }

    return (
        <StyledDataGrid
            componentsProps={{
                pagination: {
                    labelDisplayedRows: DisplayedRows,
                },
            }}
            rowHeight={60}
            disableSelectionOnClick
            pageSize={pageSize}
            autoHeight={true}
            columns={columns}
            rows={dependencyItems ?? []}
        />
    );
};

const StyledChip = styled(Chip)`
    display: flex;
    padding: 4px 7px;
    align-items: center;
    gap: 6px;
    height: auto;

    border-radius: 12px;
    background: ${({ theme }) => theme.palette.grey[100]};

    color: black;
    font-size: 10px;
    font-style: normal;
    font-weight: 400;
    line-height: 10px;

    .MuiChip-label {
        padding: 0;
    }
`;

const DisplayedRows = ({ from, to, count, page }: LabelDisplayedRowsArgs) => {
    const numPages = Math.ceil(count / pageSize) > 0 ? Math.ceil(count / pageSize) : 1;

    return (
        <DisplayedRowsWrapper>
            <div>
                <FormattedMessage
                    id="comet.dependencies.dataGrid.currentItems"
                    defaultMessage="{from} - {to} of {count} Items"
                    values={{ from, to, count }}
                />
            </div>
            <PageLabel>
                <FormattedMessage
                    id="comet.dependencies.dataGrid.currentPage"
                    defaultMessage="Page {page} of {numPages}"
                    values={{ page: page + 1, numPages }}
                />
            </PageLabel>
        </DisplayedRowsWrapper>
    );
};

const NameInfoWrapper = styled("div")`
    display: flex;
    flex-direction: column;
`;

const NameInfoTypography = styled(Typography)`
    font-size: 12px;
    font-weight: 400;
    line-height: 16px;
`;

const DisplayedRowsWrapper = styled("div")`
    display: flex;
`;

const PageLabel = styled("div")`
    flex-grow: 1;
    text-align: right;
`;

const StyledDataGrid = styled(DataGrid<DependencyItem>)`
    & .MuiTablePagination-root {
        flex-grow: 1;
    }

    & .MuiTablePagination-spacer {
        width: 0;
        flex: 0;
    }

    & .MuiTablePagination-displayedRows {
        flex-grow: 1;
    }

    & .MuiTablePagination-toolbar .MuiTablePagination-actions {
        margin-left: 5px;
    }
`;
