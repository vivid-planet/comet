import { gql } from "@apollo/client";
import { Loading, Selected, Stack, StackPage, StackSwitch } from "@comet/admin";
import { GQLEditMainMenuItemFragment } from "@src/graphql.generated";
import * as React from "react";
import { useIntl } from "react-intl";

import EditMainMenuItem, { editMainMenuItemFragment } from "./components/EditMainMenuItem";
import MainMenuItems from "./components/MainMenuItems";

const MAIN_MENU_ITEM_QUERY = gql`
    query MainMenuItem($id: ID!) {
        mainMenuItem(pageTreeNodeId: $id) {
            ...EditMainMenuItem
        }
    }

    ${editMainMenuItemFragment}
`;

const MainMenu: React.FunctionComponent = () => {
    const intl = useIntl();

    return (
        <Stack topLevelTitle={intl.formatMessage({ id: "mainMenu.menuItems", defaultMessage: "Menu items" })}>
            <StackSwitch initialPage="table">
                <StackPage name="table">
                    <MainMenuItems />
                </StackPage>
                <StackPage name="edit" title={intl.formatMessage({ id: "mainMenu.editMenuItem", defaultMessage: "Edit menu item" })}>
                    {(selectedId) => (
                        <Selected<GQLEditMainMenuItemFragment>
                            selectionMode="edit"
                            selectedId={selectedId}
                            query={MAIN_MENU_ITEM_QUERY}
                            dataAccessor="mainMenuItem"
                        >
                            {(item) => (item === undefined ? <Loading behavior="fillPageHeight" /> : <EditMainMenuItem item={item} />)}
                        </Selected>
                    )}
                </StackPage>
            </StackSwitch>
        </Stack>
    );
};

export default MainMenu;
