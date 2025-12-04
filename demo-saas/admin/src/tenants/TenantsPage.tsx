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
import { useIntl } from "react-intl";

import { TenantsForm } from "./generated/TenantsForm";
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
    const intl = useIntl();
    useContentScopeConfig({ redirectPathAfterChange: "/administration/tenants" });

    return (
        <Stack topLevelTitle={intl.formatMessage({ id: "tenants.tenants", defaultMessage: "Tenants" })}>
            <StackSwitch>
                <StackPage name="grid">
                    <StackToolbar scopeIndicator={<ContentScopeIndicator global />} />
                    <MainContent fullHeight>
                        <TenantsGrid />
                    </MainContent>
                </StackPage>
                <StackPage name="edit" title={intl.formatMessage({ id: "tenants.tenants", defaultMessage: "Edit Tenants" })}>
                    {(selectedTenantId) => (
                        <SaveBoundary>
                            <FormToolbar />
                            <MainContent>
                                <TenantsForm id={selectedTenantId} />
                            </MainContent>
                        </SaveBoundary>
                    )}
                </StackPage>
                <StackPage name="add" title={intl.formatMessage({ id: "tenants.tenants", defaultMessage: "Add Tenants" })}>
                    <SaveBoundary>
                        <FormToolbar />
                        <MainContent>
                            <TenantsForm />
                        </MainContent>
                    </SaveBoundary>
                </StackPage>
            </StackSwitch>
        </Stack>
    );
}
