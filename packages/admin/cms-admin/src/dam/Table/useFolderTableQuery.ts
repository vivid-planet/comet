import { QueryResult, useQuery } from "@apollo/client";
import { IFilterApi } from "@comet/admin";

import { GQLDamFileTableFragment, GQLDamFolderTableFragment, GQLDamItemsListQuery, GQLDamItemsListQueryVariables } from "../../graphql.generated";
import { DamFilter } from "../DamTable";
import { damItemsListQuery } from "./FolderTable.gql";

export const damItemsListLimit = 100;

const mergeDamItemsList = (previousResult: GQLDamItemsListQuery, newResult: GQLDamItemsListQuery, args: GQLDamItemsListQueryVariables) => {
    const existing = previousResult.damItemsList;
    const incoming = newResult.damItemsList;

    let merged = existing ? { ...existing, nodes: [...existing.nodes] } : { nodes: [], totalCount: 0 };
    if (args) {
        const offset = args.offset ?? 0;
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { nodes, ...restProps } = incoming;
        if (nodes != null) {
            for (let i = 0; i < incoming.nodes.length; ++i) {
                merged.nodes[offset + i] = incoming.nodes[i];
            }

            merged = { ...restProps, nodes: [...merged.nodes] };
        }
    } else {
        merged = { ...existing, ...incoming, nodes: [...merged.nodes, ...incoming.nodes] };
    }
    return { damItemsList: merged };
};

interface FolderTableQueryProps {
    folderId?: string;
    filterApi: IFilterApi<DamFilter>;
    allowedMimetypes?: string[];
}

export interface FolderTableData {
    data: Array<GQLDamFileTableFragment | GQLDamFolderTableFragment>;
    totalCount: number;
}

export interface FolderTableQueryApi extends QueryResult<GQLDamItemsListQuery, GQLDamItemsListQueryVariables> {
    tableData?: FolderTableData;
}

export const useFolderTableQuery = ({ folderId, filterApi, allowedMimetypes }: FolderTableQueryProps): FolderTableQueryApi => {
    const { data, fetchMore, ...rest } = useQuery<GQLDamItemsListQuery, GQLDamItemsListQueryVariables>(damItemsListQuery, {
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
        onCompleted: async (data) => {
            if (data) {
                const currentDataLength = data.damItemsList.nodes.length;
                const totalCount = data.damItemsList.totalCount;

                if (totalCount > currentDataLength) {
                    await fetchMore<GQLDamItemsListQuery, GQLDamItemsListQueryVariables>({
                        variables: {
                            offset: data.damItemsList.nodes.length,
                        },
                        updateQuery: (previousQueryResult, { fetchMoreResult, variables }) => {
                            return mergeDamItemsList(previousQueryResult, fetchMoreResult, variables);
                        },
                    });
                }
            }
        },
    });

    let tableData: FolderTableData | undefined = undefined;
    if (data?.damItemsList) {
        tableData = {
            data: data.damItemsList.nodes,
            totalCount: data.damItemsList.totalCount,
        };
    }

    const loading = tableData === undefined || tableData?.data.length < tableData?.totalCount;

    return {
        ...rest,
        tableData: loading ? undefined : tableData,
        loading,
        fetchMore,
        data,
    };
};
