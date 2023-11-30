import { gql } from "@apollo/client";
import { MainContent, Table, TableQuery, Toolbar, ToolbarAutomaticTitleItem, useStackSwitchApi, useTableQuery } from "@comet/admin";
import { Edit } from "@comet/admin-icons";
import { IconButton } from "@mui/material";
import { ContentScopeIndicator } from "@src/common/ContentScopeIndicator";
import { useContentScope } from "@src/common/ContentScopeProvider";
import * as React from "react";
import { FormattedMessage } from "react-intl";

import { GQLMainMenuQuery, GQLMainMenuQueryVariables } from "./MainMenuItems.generated";

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
            <ContentScopeIndicator scope={scope} variant="toolbar" />
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
                                    header: <FormattedMessage id="mainMenuItems.name" defaultMessage="Name" />,
                                },
                                {
                                    name: "node.path",
                                    header: <FormattedMessage id="mainMenuItems.path" defaultMessage="Path" />,
                                },
                                {
                                    name: "edit",
                                    header: "",
                                    cellProps: { align: "right" },
                                    render: (item) => (
                                        <IconButton color="primary" onClick={() => stackApi.activatePage("edit", item.node.id)}>
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
