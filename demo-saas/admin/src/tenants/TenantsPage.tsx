import {
    FillSpace,
    MainContent,
    SaveBoundary,
    SaveBoundarySaveButton,
    Stack,
    StackPage,
    StackSwitch,
    StackToolbar,
    ToolbarActions,
    ToolbarAutomaticTitleItem,
    ToolbarBackButton,
} from "@comet/admin";
import { ContentScopeIndicator, useContentScopeConfig } from "@comet/cms-admin";
import { FormattedMessage } from "react-intl";

import { TenantForm } from "./generated/TenantForm";
import { TenantsGrid } from "./generated/TenantsGrid";

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

    return (
        <Stack topLevelTitle={<FormattedMessage id="tenants.tenants" defaultMessage="Tenants" />}>
            <StackSwitch>
                <StackPage name="grid">
                    <StackToolbar scopeIndicator={<ContentScopeIndicator global />} />
                    <MainContent fullHeight>
                        <TenantsGrid />
                    </MainContent>
                </StackPage>
                <StackPage name="edit" title={<FormattedMessage id="tenants.tenants" defaultMessage="Edit Tenants" />}>
                    {(selectedTenantId) => (
                        <SaveBoundary>
                            <FormToolbar />
                            <MainContent>
                                <TenantForm id={selectedTenantId} />
                            </MainContent>
                        </SaveBoundary>
                    )}
                </StackPage>
                <StackPage name="add" title={<FormattedMessage id="tenants.tenants" defaultMessage="Add Tenants" />}>
                    <SaveBoundary>
                        <FormToolbar />
                        <MainContent>
                            <TenantForm />
                        </MainContent>
                    </SaveBoundary>
                </StackPage>
            </StackSwitch>
        </Stack>
    );
}
