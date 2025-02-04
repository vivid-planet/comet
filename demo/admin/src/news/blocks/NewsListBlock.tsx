import { gql, useQuery } from "@apollo/client";
import { useBufferedRowCount, useDataGridRemote, usePersistentColumnState } from "@comet/admin";
import { type BlockInterface, createBlockSkeleton } from "@comet/blocks-admin";
import { Box } from "@mui/material";
import { DataGridPro } from "@mui/x-data-grid-pro";
import { type NewsListBlockData, type NewsListBlockInput } from "@src/blocks.generated";
import { useContentScope } from "@src/common/ContentScopeProvider";
import { FormattedMessage, useIntl } from "react-intl";

import { type GQLNewsListBlockQuery, type GQLNewsListBlockQueryVariables } from "./NewsListBlock.generated";

type State = {
    ids: string[];
};

export const NewsListBlock: BlockInterface<NewsListBlockData, State, NewsListBlockInput> = {
    ...createBlockSkeleton(),
    name: "NewsList",
    displayName: <FormattedMessage id="blocks.newsList.name" defaultMessage="News List" />,
    defaultValues: () => ({ ids: [] }),
    AdminComponent: ({ state, updateState }) => {
        const { scope } = useContentScope();
        const dataGridProps = {
            ...useDataGridRemote(),
            ...usePersistentColumnState("NewsListBlock"),
        };
        const intl = useIntl();

        const { data, loading, error } = useQuery<GQLNewsListBlockQuery, GQLNewsListBlockQueryVariables>(
            gql`
                query NewsListBlock($scope: NewsContentScopeInput!) {
                    newsList(scope: $scope) {
                        nodes {
                            id
                            ...NewsListBlockNews
                        }
                        totalCount
                    }
                }
                fragment NewsListBlockNews on News {
                    title
                }
            `,
            { variables: { scope } },
        );
        const rowCount = useBufferedRowCount(data?.newsList.totalCount);

        if (error) {
            throw error;
        }

        const rows = data?.newsList.nodes ?? [];

        return (
            <Box sx={{ height: 500 }}>
                <DataGridPro
                    {...dataGridProps}
                    rows={rows}
                    rowCount={rowCount}
                    columns={[
                        {
                            field: "title",
                            headerName: intl.formatMessage({ id: "news.title", defaultMessage: "Title" }),
                            width: 150,
                        },
                    ]}
                    loading={loading}
                    checkboxSelection
                    keepNonExistentRowsSelected
                    rowSelectionModel={state.ids}
                    onRowSelectionModelChange={(newSelection) => {
                        updateState({ ids: newSelection as string[] });
                    }}
                />
            </Box>
        );
    },
};
