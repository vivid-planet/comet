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
import { BlockInterface, BlockPreview } from "@comet/blocks-admin";
import { Button, IconButton, MenuItem, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";
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

interface Filter extends Omit<GQLRedirectsQueryVariables, "active" | "type" | "scope"> {
    type?: "all" | GQLRedirectGenerationType;
    active?: "all" | "activated" | "deactivated";
}

interface Props {
    linkBlock: BlockInterface;
    scope: Record<string, unknown>;
}

export function RedirectsTable({ linkBlock, scope }: Props): JSX.Element {
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
            value: "activated",
        },
        {
            label: intl.formatMessage({
                id: "comet.redirects.redirect.active.deactivated",
                defaultMessage: "deactivated",
            }),
            value: "deactivated",
        },
    ];

    const filterApi = useTableQueryFilter<Filter>({ type: "manual", active: "all" });
    const stackApi = React.useContext(StackSwitchApiContext);

    const { tableData, api, loading, error } = useTableQuery<GQLRedirectsQuery, GQLRedirectsQueryVariables>()(redirectsQuery, {
        variables: {
            scope,
            type: filterApi.current.type !== "all" ? filterApi.current.type : undefined,
            active: filterApi.current.active !== "all" ? filterApi.current.active === "activated" : undefined,
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
                    <Field
                        name="active"
                        label={intl.formatMessage({
                            id: "comet.redirects.redirect.activation.title",
                            defaultMessage: "Activation",
                        })}
                        fullWidth
                    >
                        {(props) => (
                            <FinalFormSelect {...props} fullWidth>
                                {activeOptions.map((option) => (
                                    <MenuItem value={option.value} key={option.value}>
                                        {option.label}
                                    </MenuItem>
                                ))}
                            </FinalFormSelect>
                        )}
                    </Field>
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
                                            <TargetWrapper>
                                                <BlockPreview
                                                    title={linkBlock.dynamicDisplayName?.(state) ?? linkBlock.displayName}
                                                    content={linkBlock.previewContent(state)}
                                                />
                                            </TargetWrapper>
                                        );
                                    },
                                },
                                {
                                    name: "comment",
                                    header: intl.formatMessage({ id: "comet.pages.redirects.redirect.comment", defaultMessage: "Comment" }),
                                    render: ({ comment }) => {
                                        return <div>{comment}</div>;
                                    },
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
                                        <IconWrapper>
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
                                        </IconWrapper>
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

const TargetWrapper = styled("div")`
    max-width: 25vw;
`;

const IconWrapper = styled("div")`
    display: flex;
    flex-direction: row;
`;
