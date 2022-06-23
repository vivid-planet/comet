import { Stack, StackPage, StackSwitch } from "@comet/admin";
import * as React from "react";
import { useIntl } from "react-intl";

import { useContentScopeConfig } from "../contentScope/useContentScopeConfig";
import { AllCategories } from "../pages/pageTree/PageTreeContext";
import { RedirectForm } from "./RedirectForm";
import { RedirectsTable } from "./RedirectsTable";

interface Props {
    redirectPathAfterChange?: string;
    allCategories: AllCategories;
}
export function Redirects({ redirectPathAfterChange, allCategories }: Props): JSX.Element {
    const intl = useIntl();
    useContentScopeConfig({ redirectPathAfterChange });

    return (
        <Stack topLevelTitle={intl.formatMessage({ id: "comet.pages.redirects", defaultMessage: "Redirects" })}>
            <StackSwitch initialPage="redirectsTable">
                <StackPage name="redirectsTable">
                    <RedirectsTable />
                </StackPage>
                <StackPage name="edit" title={intl.formatMessage({ id: "comet.pages.redirects.edit", defaultMessage: "edit" })}>
                    {(selectedId: string) => {
                        return <RedirectForm mode="edit" id={selectedId} allCategories={allCategories} />;
                    }}
                </StackPage>
                <StackPage name="add" title={intl.formatMessage({ id: "comet.pages.redirects.create", defaultMessage: "create" })}>
                    {() => {
                        return <RedirectForm mode="add" allCategories={allCategories} />;
                    }}
                </StackPage>
            </StackSwitch>
        </Stack>
    );
}
