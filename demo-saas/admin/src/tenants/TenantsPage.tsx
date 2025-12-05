import { useApolloClient } from "@apollo/client";
import {
    FieldSet,
    FillSpace,
    FullHeightContent,
    MainContent,
    RouterTab,
    RouterTabs,
    SaveBoundary,
    SaveBoundarySaveButton,
    Stack,
    StackMainContent,
    StackPage,
    StackToolbar,
    ToolbarActions,
    ToolbarAutomaticTitleItem,
    ToolbarBackButton,
    useStackSwitch,
} from "@comet/admin";
import { ContentScopeIndicator, useContentScopeConfig } from "@comet/cms-admin";
import { FormattedMessage } from "react-intl";

import { TenantForm } from "./generated/TenantForm";
import { TenantsGrid } from "./generated/TenantsGrid";
import { TenantScopeForm } from "./tenantScope/generated/TenantScopeForm";
import { TenantScopesGrid } from "./tenantScope/generated/TenantScopesGrid";

const FormToolbar = () => (
    <StackToolbar scopeIndicator={<ContentScopeIndicator global />}>
        <ToolbarBackButton />
        <ToolbarAutomaticTitleItem />
        <FillSpace />
        <ToolbarActions>
            <SaveBoundarySaveButton />
        </ToolbarActions>
    </StackToolbar>
);

export function TenantsPage() {
    useContentScopeConfig({ redirectPathAfterChange: "/administration/tenants" });
    const [TenantsStackSwitch, tenantsStackSwitchApi] = useStackSwitch();
    const [TenantScopesStackSwitch, tenantScopesStackSwitchApi] = useStackSwitch();
    const client = useApolloClient();
    return (
        <Stack topLevelTitle={<FormattedMessage id="tenants.tenants" defaultMessage="Tenants" />}>
            <TenantsStackSwitch>
                <StackPage name="grid">
                    <StackToolbar scopeIndicator={<ContentScopeIndicator global />} />
                    <MainContent fullHeight>
                        <TenantsGrid />
                    </MainContent>
                </StackPage>
                <StackPage name="edit" title={<FormattedMessage id="tenants.tenants" defaultMessage="Edit Tenants" />}>
                    {(selectedTenantId) => (
                        <SaveBoundary>
                            <>
                                <FormToolbar />
                                <StackMainContent>
                                    <RouterTabs>
                                        <RouterTab
                                            forceRender={true}
                                            path=""
                                            label={<FormattedMessage id="tenants.baseData" defaultMessage="Base Data" />}
                                        >
                                            <FieldSet>
                                                <TenantForm id={selectedTenantId} />
                                            </FieldSet>
                                        </RouterTab>
                                        <RouterTab
                                            forceRender={true}
                                            path="/scope"
                                            label={<FormattedMessage id="tenants.scopes" defaultMessage="Scopes" />}
                                        >
                                            <TenantScopesStackSwitch initialPage="table">
                                                <StackPage name="table">
                                                    <FullHeightContent>
                                                        <TenantScopesGrid tenant={selectedTenantId} />
                                                    </FullHeightContent>
                                                </StackPage>
                                                <StackPage
                                                    name="edit"
                                                    title={<FormattedMessage id="tenants.editTenantScope" defaultMessage="Edit Tenant Scope" />}
                                                >
                                                    {(selectedTenantScopeId) => (
                                                        <SaveBoundary>
                                                            <StackToolbar scopeIndicator={<ContentScopeIndicator global />}>
                                                                <ToolbarBackButton />
                                                                <ToolbarAutomaticTitleItem />
                                                                <FillSpace />
                                                                <ToolbarActions>
                                                                    <SaveBoundarySaveButton />
                                                                </ToolbarActions>
                                                            </StackToolbar>
                                                            <StackMainContent>
                                                                <FieldSet>
                                                                    <TenantScopeForm id={selectedTenantScopeId} tenant={selectedTenantId} />
                                                                </FieldSet>
                                                            </StackMainContent>
                                                        </SaveBoundary>
                                                    )}
                                                </StackPage>
                                                <StackPage
                                                    name="add"
                                                    title={<FormattedMessage id="tenants.addTenantScope" defaultMessage="Add Tenant Scope" />}
                                                >
                                                    <SaveBoundary>
                                                        <StackToolbar scopeIndicator={<ContentScopeIndicator global />}>
                                                            <ToolbarBackButton />
                                                            <ToolbarAutomaticTitleItem />
                                                            <FillSpace />
                                                            <ToolbarActions>
                                                                <SaveBoundarySaveButton />
                                                            </ToolbarActions>
                                                        </StackToolbar>
                                                        <StackMainContent>
                                                            <FieldSet>
                                                                <TenantScopeForm
                                                                    onCreate={async (id) => {
                                                                        tenantScopesStackSwitchApi.activatePage("edit", id);
                                                                        client.refetchQueries({
                                                                            include: ["CurrentUser"],
                                                                        });
                                                                    }}
                                                                    tenant={selectedTenantId}
                                                                />
                                                            </FieldSet>
                                                        </StackMainContent>
                                                    </SaveBoundary>
                                                </StackPage>
                                            </TenantScopesStackSwitch>
                                        </RouterTab>
                                    </RouterTabs>
                                </StackMainContent>
                            </>
                        </SaveBoundary>
                    )}
                </StackPage>
                <StackPage name="add" title={<FormattedMessage id="tenants.tenants" defaultMessage="Add Tenants" />}>
                    <SaveBoundary>
                        <FormToolbar />
                        <MainContent>
                            <TenantForm
                                onCreate={(id) => {
                                    tenantsStackSwitchApi.activatePage("edit", id);
                                }}
                            />
                        </MainContent>
                    </SaveBoundary>
                </StackPage>
            </TenantsStackSwitch>
        </Stack>
    );
}
