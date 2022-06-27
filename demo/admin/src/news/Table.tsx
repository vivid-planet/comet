import {
    MainContent,
    StackSwitchApiContext,
    Table,
    TableDeleteButton,
    TableQuery,
    Toolbar,
    ToolbarAutomaticTitleItem,
    ToolbarFillSpace,
    ToolbarItem,
    useTableQuery,
} from "@comet/admin";
import { Add as AddIcon, Delete as DeleteIcon, Domain, Edit } from "@comet/admin-icons";
import { ContentScopeIndicator } from "@comet/cms-admin";
import { EditPageLayout } from "@comet/cms-admin/lib";
import { Button, IconButton } from "@mui/material";
import { ScopeIndicatorContent, ScopeIndicatorLabel, ScopeIndicatorLabelBold } from "@src/common/ContentScopeIndicatorStyles";
import { useContentScope } from "@src/common/ContentScopeProvider";
import { GQLNewsListQuery, GQLNewsListQueryVariables, namedOperations } from "@src/graphql.generated";
import gql from "graphql-tag";
import React from "react";
import { FormattedMessage } from "react-intl";

const NewsTable: React.FC = () => {
    const stackApi = React.useContext(StackSwitchApiContext);
    const { scope } = useContentScope();

    const { api, tableData, loading, error } = useTableQuery<GQLNewsListQuery, GQLNewsListQueryVariables>()(newsListQuery, {
        variables: {
            scope,
        },
        resolveTableData: (data) => ({
            data: data.newsList.nodes,
            totalCount: data.newsList.nodes.length,
        }),
    });

    return (
        <EditPageLayout>
            <ContentScopeIndicator variant="toolbar">
                <ScopeIndicatorContent>
                    <Domain fontSize="small" />
                    <ScopeIndicatorLabelBold variant="body2">{scope.domain}</ScopeIndicatorLabelBold>
                </ScopeIndicatorContent>
                {` | `}
                <ScopeIndicatorLabel variant="body2">{scope.language}</ScopeIndicatorLabel>
            </ContentScopeIndicator>
            <Toolbar>
                <ToolbarAutomaticTitleItem />
                <ToolbarFillSpace />
                <ToolbarItem>
                    <Button startIcon={<AddIcon />} onClick={() => stackApi.activatePage("edit", "new")} variant="contained" color="primary">
                        <FormattedMessage id="comet.news.newNews" defaultMessage="New News" />
                    </Button>
                </ToolbarItem>
            </Toolbar>
            <MainContent>
                <TableQuery api={api} loading={loading} error={error}>
                    {tableData && (
                        <Table
                            {...tableData}
                            columns={[
                                {
                                    name: "title",
                                    header: <FormattedMessage id="comet.generic.title" defaultMessage="Title" />,
                                },
                                {
                                    name: "slug",
                                    header: <FormattedMessage id="comet.generic.slug" defaultMessage="Slug" />,
                                },

                                {
                                    name: "actions",
                                    render: (news) => (
                                        <>
                                            <IconButton onClick={() => stackApi.activatePage("edit", news.id)}>
                                                <Edit color="primary" />
                                            </IconButton>
                                            <TableDeleteButton
                                                icon={<DeleteIcon />}
                                                mutation={deleteNewsMutation}
                                                refetchQueries={[namedOperations.Query.NewsList]}
                                                selectedId={news.id}
                                                text=""
                                            />
                                        </>
                                    ),
                                },
                            ]}
                        />
                    )}
                </TableQuery>
            </MainContent>
        </EditPageLayout>
    );
};

export default NewsTable;

const newsListQuery = gql`
    query NewsList($scope: NewsContentScopeInput!) {
        newsList(scope: $scope) {
            nodes {
                id
                slug
                title
            }
        }
    }
`;

export const deleteNewsMutation = gql`
    mutation DeleteNews($id: ID!) {
        deleteNews(id: $id)
    }
`;
