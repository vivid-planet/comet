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
import { DepartmentForm } from "@src/departments/generated/DepartmentForm";
import { DepartmentsGrid } from "@src/departments/generated/DepartmentsGrid";
import { FormattedMessage, useIntl } from "react-intl";

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
    const intl = useIntl();
    useContentScopeConfig({ redirectPathAfterChange: "/administration/tenants" });
    const [TenantsStackSwitch, tenantsStackSwitchApi] = useStackSwitch();
    const [DepartmentsStackSwitch, departmentsStackSwitchApi] = useStackSwitch();
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
                                            path="/department"
                                            label={<FormattedMessage id="tenants.departments" defaultMessage="Departments" />}
                                        >
                                            <DepartmentsStackSwitch initialPage="table">
                                                <StackPage name="table">
                                                    <FullHeightContent>
                                                        <DepartmentsGrid tenant={selectedTenantId} />
                                                    </FullHeightContent>
                                                </StackPage>
                                                <StackPage
                                                    name="edit"
                                                    // Has to be intl.formatMessage, because otherwise there is an error (maximum update depth exceeded)
                                                    title={intl.formatMessage({ id: "tenants.editDepartment", defaultMessage: "Edit Department" })}
                                                >
                                                    {(selectedDepartmentId) => (
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
                                                                    <DepartmentForm id={selectedDepartmentId} tenant={selectedTenantId} />
                                                                </FieldSet>
                                                            </StackMainContent>
                                                        </SaveBoundary>
                                                    )}
                                                </StackPage>
                                                <StackPage
                                                    name="add"
                                                    // Has to be intl.formatMessage, because otherwise there is an error (maximum update depth exceeded)
                                                    title={intl.formatMessage({ id: "tenants.addDepartment", defaultMessage: "Add Department" })}
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
                                                                <DepartmentForm
                                                                    onCreate={async (id) => {
                                                                        departmentsStackSwitchApi.activatePage("edit", id);
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
                                            </DepartmentsStackSwitch>
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
