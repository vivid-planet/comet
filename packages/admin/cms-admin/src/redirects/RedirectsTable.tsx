import {
    Field,
    FinalFormSearchTextField,
    FinalFormSelect,
    LocalErrorScopeApolloContext,
    MainContent,
    StackSwitchApiContext,
    Table,
    TableDeleteButton,
    TableFilterFinalForm,
    TableQuery,
    Toolbar,
    ToolbarActions,
    ToolbarFillSpace,
    ToolbarItem,
    useTableQuery,
    useTableQueryFilter,
} from "@comet/admin";
import { Add as AddIcon, Delete as DeleteIcon, Edit } from "@comet/admin-icons";
import { FinalFormReactSelectStaticOptions } from "@comet/admin-react-select";
import { BlockInterface, BlockPreview } from "@comet/blocks-admin";
import { Button, IconButton, MenuItem, Typography } from "@mui/material";
import * as React from "react";
import { FormattedMessage, useIntl } from "react-intl";

import {
    GQLRedirectGenerationType,
    GQLRedirectsQuery,
    GQLRedirectsQueryVariables,
    GQLRedirectTableFragment,
    namedOperations,
} from "../graphql.generated";
import RedirectActiveness from "./RedirectActiveness";
import { deleteRedirectMutation, redirectsQuery } from "./RedirectsTable.gql";

interface Filter extends Omit<GQLRedirectsQueryVariables, "active" | "type"> {
    type?: "all" | GQLRedirectGenerationType;
    active?: "all" | boolean;
}

interface Props {
    linkBlock: BlockInterface;
}

export function RedirectsTable({ linkBlock }: Props): JSX.Element {
    const intl = useIntl();

    const typeOptions = [
        {
            label: intl.formatMessage({
                id: "comet.redirects.redirect.generationType.all",
                defaultMessage: "All",
            }),
            value: "all",
        },
        {
            label: intl.formatMessage({
                id: "comet.redirects.redirect.generationType.manual",
                defaultMessage: "Manual",
            }),
            value: "manual",
        },
        {
            label: intl.formatMessage({
                id: "comet.redirects.redirect.generationType.automatic",
                defaultMessage: "Automatic",
            }),
            value: "automatic",
        },
    ];

    const activeOptions = [
        {
            label: intl.formatMessage({
                id: "comet.redirects.redirect.active.all",
                defaultMessage: "All",
            }),
            value: "all",
        },
        {
            label: intl.formatMessage({
                id: "comet.redirects.redirect.active.activated",
                defaultMessage: "activated",
            }),
            value: true,
        },
        {
            label: intl.formatMessage({
                id: "comet.redirects.redirect.active.deactivated",
                defaultMessage: "deactivated",
            }),
            value: false,
        },
    ];

    const filterApi = useTableQueryFilter<Filter>({ type: "manual", active: "all" });
    const stackApi = React.useContext(StackSwitchApiContext);

    const { tableData, api, loading, error } = useTableQuery<GQLRedirectsQuery, GQLRedirectsQueryVariables>()(redirectsQuery, {
        variables: {
            type: filterApi.current.type !== "all" ? filterApi.current.type : undefined,
            active: filterApi.current.active !== "all" ? filterApi.current.active : undefined,
            query: filterApi.current.query ?? undefined,
            sortDirection: "ASC",
            sortColumnName: "source",
        },
        resolveTableData: ({ redirects }) => {
            return {
                data: redirects,
                totalCount: redirects.length,
            };
        },
        context: LocalErrorScopeApolloContext,
    });

    return (
        <TableFilterFinalForm filterApi={filterApi}>
            <Toolbar>
                <ToolbarItem>
                    <Field name="query" component={FinalFormSearchTextField} />
                </ToolbarItem>
                <ToolbarItem>
                    <Field
                        name="type"
                        label={intl.formatMessage({
                            id: "comet.redirects.redirect.generationType.type",
                            defaultMessage: "Redirect Type",
                        })}
                        fullWidth
                    >
                        {(props) => (
                            <FinalFormSelect {...props} fullWidth>
                                {typeOptions.map((option) => (
                                    <MenuItem value={option.value} key={option.value}>
                                        {option.label}
                                    </MenuItem>
                                ))}
                            </FinalFormSelect>
                        )}
                    </Field>
                </ToolbarItem>
                <ToolbarItem>
                    {/* TODO: Replace with FinalFormSelect when boolean-values have been changed to strings */}
                    <Field
                        name="active"
                        defaultValue="all"
                        label={intl.formatMessage({
                            id: "comet.redirects.redirect.activation.title",
                            defaultMessage: "Activation",
                        })}
                        component={FinalFormReactSelectStaticOptions}
                        options={activeOptions}
                        isSearchable={false}
                    />
                </ToolbarItem>
                <ToolbarFillSpace />
                <ToolbarActions>
                    <Button
                        variant="contained"
                        color="primary"
                        startIcon={<AddIcon />}
                        onClick={() => {
                            stackApi.activatePage("add", "new");
                        }}
                    >
                        <FormattedMessage id="comet.pages.redirects.add" defaultMessage="Add" />
                    </Button>
                </ToolbarActions>
            </Toolbar>
            <MainContent>
                <TableQuery api={api} loading={loading} error={error}>
                    {tableData?.data && (
                        <Table
                            {...tableData}
                            columns={[
                                {
                                    name: "source",
                                    header: intl.formatMessage({ id: "comet.pages.redirects.redirect.source", defaultMessage: "Source" }),
                                },
                                {
                                    name: "target",
                                    header: intl.formatMessage({ id: "comet.pages.redirects.redirect.target", defaultMessage: "Target" }),
                                    render: (row: GQLRedirectTableFragment) => {
                                        const state = linkBlock.input2State(row.target);
                                        return (
                                            <BlockPreview
                                                title={linkBlock.dynamicDisplayName?.(state) ?? linkBlock.displayName}
                                                content={linkBlock.previewContent(state)}
                                            />
                                        );
                                    },
                                },
                                {
                                    name: "comment",
                                    header: intl.formatMessage({ id: "comet.pages.redirects.redirect.comment", defaultMessage: "Comment" }),
                                },
                                {
                                    name: "generationType",
                                    header: intl.formatMessage({
                                        id: "comet.pages.redirects.redirect.generationType",
                                        defaultMessage: "GenerationType",
                                    }),
                                    render: (row: GQLRedirectTableFragment) => {
                                        return (
                                            <Typography>
                                                {row.generationType === "manual" ? (
                                                    <FormattedMessage id="comet.redirects.redirect.generationType.manual" defaultMessage="Manual" />
                                                ) : (
                                                    <FormattedMessage
                                                        id="comet.redirects.redirect.generationType.automatic"
                                                        defaultMessage="Automatic"
                                                    />
                                                )}
                                            </Typography>
                                        );
                                    },
                                },
                                {
                                    name: "activeness",
                                    header: intl.formatMessage({
                                        id: "comet.pages.redirects.redirect.activation",
                                        defaultMessage: "Activation",
                                    }),
                                    render: (row: GQLRedirectTableFragment) => <RedirectActiveness redirect={row} />,
                                },
                                {
                                    name: "actions",
                                    header: "",
                                    render: (row: GQLRedirectTableFragment) => (
                                        <>
                                            <IconButton
                                                onClick={() => {
                                                    stackApi.activatePage("edit", row.id);
                                                }}
                                            >
                                                <Edit color="primary" />
                                            </IconButton>
                                            <TableDeleteButton
                                                icon={<DeleteIcon />}
                                                mutation={deleteRedirectMutation}
                                                refetchQueries={[namedOperations.Query.Redirects]}
                                                selectedId={row.id}
                                                text=""
                                            />
                                        </>
                                    ),
                                },
                            ]}
                        />
                    )}
                </TableQuery>
            </MainContent>
        </TableFilterFinalForm>
    );
}
