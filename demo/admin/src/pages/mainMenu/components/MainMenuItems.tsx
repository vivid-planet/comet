import { gql } from "@apollo/client";
import { MainContent, Table, TableQuery, Toolbar, ToolbarAutomaticTitleItem, useStackSwitchApi, useTableQuery } from "@comet/admin";
import { Domain, Edit } from "@comet/admin-icons";
import { ContentScopeIndicator } from "@comet/cms-admin";
import { IconButton } from "@mui/material";
import { ScopeIndicatorContent, ScopeIndicatorLabel, ScopeIndicatorLabelBold } from "@src/common/ContentScopeIndicatorStyles";
import { useContentScope } from "@src/common/ContentScopeProvider";
import { GQLMainMenuQuery, GQLMainMenuQueryVariables } from "@src/graphql.generated";
import * as React from "react";
import { FormattedMessage } from "react-intl";

const mainMenuQuery = gql`
    query MainMenu($contentScope: PageTreeNodeScopeInput!) {
        mainMenu(scope: $contentScope) {
            items {
                node {
                    id
                    name
                    path
                }
                content
            }
        }
    }
`;

const MainMenuItems: React.FunctionComponent = () => {
    const stackApi = useStackSwitchApi();
    const { scope } = useContentScope();

    const { tableData, api, loading, error } = useTableQuery<GQLMainMenuQuery, GQLMainMenuQueryVariables>()(mainMenuQuery, {
        variables: {
            contentScope: scope,
        },
        resolveTableData: ({ mainMenu }) => ({
            data: mainMenu.items.map((item) => ({ ...item, id: item.node.id })),
            totalCount: mainMenu.items.length,
        }),
    });

    return (
        <>
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
            </Toolbar>

            <MainContent>
                <TableQuery api={api} loading={loading} error={error}>
                    {tableData?.data && (
                        <Table
                            {...tableData}
                            columns={[
                                {
                                    name: "node.name",
                                    header: <FormattedMessage id="cometDemo.mainMenuItems.name" defaultMessage="Name" />,
                                },
                                {
                                    name: "node.path",
                                    header: <FormattedMessage id="cometDemo.mainMenuItems.path" defaultMessage="Path" />,
                                },
                                {
                                    name: "edit",
                                    header: "",
                                    render: (item) => (
                                        <IconButton onClick={() => stackApi.activatePage("edit", item.node.id)}>
                                            <Edit />
                                        </IconButton>
                                    ),
                                },
                            ]}
                        />
                    )}
                </TableQuery>
            </MainContent>
        </>
    );
};

export default MainMenuItems;
