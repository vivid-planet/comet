---
"@comet/cms-admin": minor
---

Export components to allow customization of User Permissions Admin panel

The application can provide an own UserPermissionsPage based on the following code:

```ts
export const UserPermissionsPage = () => (
    <Stack topLevelTitle={<FormattedMessage id="comet.userPermissions.title" defaultMessage="User Permissions" />}>
        <StackSwitch>
            <StackPage name="table">
                <StackToolbar scopeIndicator={<ContentScopeIndicator global />} />
                <MainContent fullHeight>
                    <UserPermissionsUserGrid
                        rowAction={(params) => (
                            <IconButton component={StackLink} pageName="edit" payload={params.row.id} subUrl="permissions">
                                <Edit color="primary" />
                            </IconButton>
                        )}
                    />
                </MainContent>
            </StackPage>
            <StackPage name="edit" title={<FormattedMessage id="comet.userPermissions.edit" defaultMessage="User" />}>
                {(userId) => (
                    <>
                        <UserPermissionsUserPageToolbar userId={userId} />
                        <MainContent>
                            <RouterTabs>
                                <RouterTab path="" label={<FormattedMessage id="comet.userPermissions.basicData" defaultMessage="Basic Data" />}>
                                    <UserPermissionsUserPageBasicDataPanel userId={userId} />
                                </RouterTab>
                                <RouterTab
                                    path="/permissions"
                                    label={<FormattedMessage id="comet.userPermissions.permissions" defaultMessage="Permissions" />}
                                >
                                    <UserPermissionsUserPagePermissionsPanel userId={userId} />
                                </RouterTab>
                            </RouterTabs>
                        </MainContent>
                    </>
                )}
            </StackPage>
        </StackSwitch>
    </Stack>
);
```
