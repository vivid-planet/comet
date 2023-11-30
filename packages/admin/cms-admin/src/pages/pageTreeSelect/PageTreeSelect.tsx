import { gql, useQuery } from "@apollo/client";
import { Link } from "@comet/admin-icons";
import { AdminComponentButton, AdminComponentNestedButton } from "@comet/blocks-admin";
import * as React from "react";
import { FormattedMessage } from "react-intl";

import { GQLPageTreeSelectDetailQuery, GQLPageTreeSelectDetailQueryVariables } from "./PageTreeSelect.generated";
import PageTreeSelectDialog, { GQLSelectedPageFragment } from "./PageTreeSelectDialog";

interface PageTreeSelectProps {
    value: GQLSelectedPageFragment | undefined | null;
    onChange: (newValue: GQLSelectedPageFragment | null) => void;
}

const pageTreeSelectDetail = gql`
    query PageTreeSelectDetail($id: ID!) {
        page: pageTreeNode(id: $id) {
            category
        }
    }
`;

export default function PageTreeSelect({ value, onChange }: PageTreeSelectProps): JSX.Element {
    const [open, setOpen] = React.useState(false);

    const { data, loading } = useQuery<GQLPageTreeSelectDetailQuery, GQLPageTreeSelectDetailQueryVariables>(pageTreeSelectDetail, {
        variables: { id: value?.id as string },
        skip: !value?.id,
    });

    const handleButtonClick = () => setOpen(true);

    const selectedCategory = data?.page?.category || "MainNavigation";

    return (
        <>
            {value ? (
                <AdminComponentNestedButton onClick={handleButtonClick} displayName={value.name} preview={value.path} />
            ) : (
                <AdminComponentButton onClick={handleButtonClick} size="large" startIcon={<Link />} disabled={loading}>
                    <FormattedMessage id="comet.pages.pageTreeSelect.label" defaultMessage="Select Page" />
                </AdminComponentButton>
            )}

            {/* Render Dialog only when open is true to prevent render-cycles originating from setQuery in usePageQuery */}
            {open && (
                <PageTreeSelectDialog
                    open={open}
                    onClose={() => setOpen(false)}
                    value={value}
                    onChange={onChange}
                    defaultCategory={selectedCategory}
                />
            )}
        </>
    );
}
