import { IFilterApi, ITableData, ITableQueryHookResult, useTableQuery } from "@comet/admin";
import React from "react";

import { GQLDamFileTableFragment, GQLDamFolderTableFragment, GQLDamItemsListQuery, GQLDamItemsListQueryVariables } from "../../graphql.generated";
import { DamFilter } from "../DamTable";
import { damItemsListQuery } from "./FolderTable.gql";

export const damItemsListLimit = 100;

interface FolderTableQueryProps {
    folderId?: string;
    filterApi: IFilterApi<DamFilter>;
    allowedMimetypes?: string[];
}

export type FolderTableQueryApi = ITableQueryHookResult<
    GQLDamItemsListQuery,
    GQLDamItemsListQueryVariables,
    ITableData<GQLDamFolderTableFragment | GQLDamFileTableFragment>
>;

export const useFolderTableQuery = ({ folderId, filterApi, allowedMimetypes }: FolderTableQueryProps): FolderTableQueryApi => {
    const { tableData, fetchMore, ...rest } = useTableQuery<GQLDamItemsListQuery, GQLDamItemsListQueryVariables>()(damItemsListQuery, {
        variables: {
            folderId: folderId,
            includeArchived: filterApi.current.archived,
            filter: {
                mimetypes: allowedMimetypes,
                searchText: filterApi.current.searchText,
            },
            sortColumnName: filterApi.current.sort?.columnName,
            sortDirection: filterApi.current.sort?.direction,
            limit: damItemsListLimit,
            offset: 0,
        },
        resolveTableData: ({ damItemsList }) => {
            return {
                data: damItemsList.nodes,
                totalCount: damItemsList.totalCount,
            };
        },
        fetchPolicy: "cache-and-network",
    });

    React.useEffect(() => {
        if (tableData && tableData?.data.length < tableData?.totalCount) {
            fetchMore<GQLDamItemsListQuery, GQLDamItemsListQueryVariables>({
                variables: {
                    offset: tableData?.data?.length ?? 0,
                },
            });
        }
    }, [fetchMore, tableData]);

    const loading = tableData === undefined || tableData.data.length < tableData.totalCount;

    return {
        ...rest,
        tableData,
        loading,
        fetchMore,
    };
};
