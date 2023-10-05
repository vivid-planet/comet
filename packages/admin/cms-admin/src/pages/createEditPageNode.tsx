import { gql, useApolloClient, useQuery } from "@apollo/client";
import { ErrorScope, Field, FieldContainer, FinalForm, FinalFormCheckbox, FinalFormInput, FinalFormSelect, Loading } from "@comet/admin";
import { FormControlLabel, MenuItem, Typography } from "@mui/material";
import { Mutator } from "final-form";
import setFieldTouched from "final-form-set-field-touched";
import { DocumentNode } from "graphql";
import debounce from "p-debounce";
import React from "react";
import { FormSpy } from "react-final-form";
import { useIntl } from "react-intl";
import slugify from "slugify";

import { useContentScope } from "../contentScope/Provider";
import { DocumentInterface, DocumentType } from "../documents/types";
import { SyncFields } from "../form/SyncFields";
import {
    GQLCreatePageNodeMutation,
    GQLCreatePageNodeMutationVariables,
    GQLEditPageNodeQuery,
    GQLEditPageNodeQueryVariables,
    GQLEditPageParentNodeQuery,
    GQLEditPageParentNodeQueryVariables,
    GQLIsPathAvailableQuery,
    GQLIsPathAvailableQueryVariables,
    GQLSlugAvailability,
    GQLUpdatePageNodeMutation,
    GQLUpdatePageNodeMutationVariables,
    namedOperations,
} from "../graphql.generated";
import { useLocale } from "../locale/useLocale";

type SerializedInitialValues = string;

export interface EditPageNodeFinalFormValues {
    [key: string]: unknown;
}

interface CreateEditPageNodeProps {
    additionalFormFields?: React.ReactNode;
    nodeFragment?: { name: string; fragment: DocumentNode };
    valuesToInput?: (values: EditPageNodeFinalFormValues) => EditPageNodeFinalFormValues;
}

export interface EditPageNodeProps {
    id: null | SerializedInitialValues | string; // when mode is add: SerializedInitialValues is expected
    mode: "add" | "edit";
    category: string;
    documentTypes: Record<DocumentType, DocumentInterface>;
}

export function createEditPageNode({
    additionalFormFields,
    nodeFragment,
    valuesToInput,
}: CreateEditPageNodeProps): (props: EditPageNodeProps) => JSX.Element {
    const editPageNodeQuery = gql`
        query EditPageNode($id: ID!) {
            page: pageTreeNode(id: $id) {
                id
                name
                slug
                path
                documentType
                hideInMenu
                parentId
                document {
                    ... on DocumentInterface {
                        id
                    }
                }
                ${nodeFragment ? "...".concat(nodeFragment?.name) : ""}
            }
        }
        ${nodeFragment ? nodeFragment?.fragment : ""}
    `; // @TODO: use a graphql interface to ommit the ...on (DocumentInterface)

    const updatePageNodeMutation = gql`
        mutation UpdatePageNode($nodeId: ID!, $input: PageTreeNodeUpdateInput!) {
            updatePageTreeNode(id: $nodeId, input: $input) {
                id
                name
                slug
                documentType
                hideInMenu
                document {
                    ... on DocumentInterface {
                        id
                    }
                }
                ${nodeFragment ? "...".concat(nodeFragment?.name) : ""}
            }
        }
        ${nodeFragment ? nodeFragment?.fragment : ""}
    `;

    function EditPageNode({ id, mode, category, documentTypes }: EditPageNodeProps): React.ReactElement {
        const { pos, parent } = unserializeInitialValues(id);

        const intl = useIntl();
        const apollo = useApolloClient();
        const { scope } = useContentScope();
        const locale = useLocale({ scope });

        const [manuallyChangedSlug, setManuallyChangedSlug] = React.useState<boolean>(mode === "edit");

        const { loading, data } = useQuery<GQLEditPageNodeQuery, GQLEditPageNodeQueryVariables>(editPageNodeQuery, {
            variables: {
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                id: id!,
            },
            fetchPolicy: "network-only", // The path could have changed (due to reordering of pages), so it's safe to have fresh data
            skip: mode === "add",
        });

        const slug = data?.page?.slug;

        const parentId = mode === "add" ? parent : data?.page?.parentId ?? null;

        const { data: parentNodeData } = useQuery<GQLEditPageParentNodeQuery, GQLEditPageParentNodeQueryVariables>(editPageParentNodeQuery, {
            variables: {
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                parentId: parentId!,
            },
            fetchPolicy: "network-only",
            skip: parentId === null,
        });

        let parentPath: string | null = null;

        if (parentNodeData?.pageTreeNode) {
            parentPath = parentNodeData.pageTreeNode.slug === "home" ? "/home" : parentNodeData.pageTreeNode.path;
        }

        const options = Object.keys(documentTypes).map((type) => ({
            value: type,
            label: documentTypes[type].displayName,
        }));

        const isPathAvailable = React.useCallback(
            async (newSlug: string): Promise<GQLSlugAvailability> => {
                if (slug === newSlug) {
                    // The unchanged slug is expected to be available
                    return "Available";
                }
                const { data } = await apollo.query<GQLIsPathAvailableQuery, GQLIsPathAvailableQueryVariables>({
                    query: isPathAvailableQuery,
                    variables: {
                        parentId,
                        slug: newSlug,
                        scope,
                    },
                    fetchPolicy: "network-only",
                });

                return data.availability;
            },
            [apollo, scope, parentId, slug],
        );

        const validateSlug = async (value: string) => {
            if (!isValidSlug(value)) {
                return intl.formatMessage({
                    id: "comet.pages.pages.page.validate.slug.error",
                    defaultMessage: "Slug contains forbidden symbols",
                });
            }
            if (value) {
                const pathAvailability = await isPathAvailable(value);

                if (pathAvailability === "Taken") {
                    return intl.formatMessage({
                        id: "comet.pages.pages.page.validate.path.taken",
                        defaultMessage: "Slug leads to duplicated path",
                    });
                }

                if (pathAvailability === "Reserved") {
                    return intl.formatMessage({
                        id: "comet.pages.pages.page.validate.path.block",
                        defaultMessage: "Slug leads to reserved path",
                    });
                }
            }
        };

        // Use `p-debounce` instead of `use-debounce`
        // because Final Form expects all validate calls to be resolved.
        // `p-debounce` resolves all calls, `use-debounce` doesn't
        const debouncedValidateSlug = debounce(validateSlug, 200);

        if (mode === "edit" && (loading || !data?.page)) {
            return <Loading />;
        }
        return (
            <div>
                <FinalForm<FormValues>
                    mode={mode}
                    mutators={{
                        setFieldTouched: setFieldTouched as Mutator<FormValues>,
                    }}
                    onSubmit={async (values: FormValues) => {
                        let input = {
                            name: values.name,
                            slug: values.slug,
                            hideInMenu: values.hideInMenu,
                            attachedDocument: {
                                id: values.documentType === data?.page?.documentType ? data?.page?.document?.id : undefined,
                                type: values.documentType,
                            },
                        };

                        if (valuesToInput) {
                            input = { ...input, ...valuesToInput({ values }) };
                        }

                        if (mode === "edit") {
                            if (!id) {
                                throw new Error("Missing ID in edit mode");
                            }

                            await apollo.mutate<GQLUpdatePageNodeMutation, GQLUpdatePageNodeMutationVariables>({
                                mutation: updatePageNodeMutation,
                                variables: {
                                    nodeId: id,
                                    input,
                                },
                                context: {
                                    errorScope: ErrorScope.Local,
                                },
                            });
                        } else {
                            await apollo.mutate<GQLCreatePageNodeMutation, GQLCreatePageNodeMutationVariables>({
                                mutation: createPageNodeMutation,
                                variables: {
                                    input: {
                                        ...input,
                                        parentId,
                                        pos,
                                    },
                                    contentScope: scope,
                                    category,
                                },
                                context: {
                                    errorScope: ErrorScope.Local,
                                },
                                refetchQueries: [namedOperations.Query.Pages],
                            });
                        }
                    }}
                    initialValues={data?.page ?? { documentType: Object.keys(documentTypes)[0] }}
                    render={({ form }) => {
                        return (
                            <>
                                {!manuallyChangedSlug && (
                                    <SyncFields<string, string>
                                        sourceField="name"
                                        targetField="slug"
                                        onChange={(name) => {
                                            const slug = transformToSlug(name, locale);
                                            if (!form.getFieldState("slug")?.touched) {
                                                // Set field touched because otherwise no validation errors are shown
                                                form.mutators.setFieldTouched("slug", true);
                                            }
                                            return slug;
                                        }}
                                    />
                                )}
                                <Field
                                    label={intl.formatMessage({
                                        id: "comet.pages.pages.page.name",
                                        defaultMessage: "Name",
                                    })}
                                    name="name"
                                    required
                                    component={FinalFormInput}
                                    autoFocus
                                    fullWidth
                                />
                                {slug !== "home" && (
                                    <Field
                                        label={intl.formatMessage({
                                            id: "comet.pages.pages.page.slug",
                                            defaultMessage: "Slug",
                                        })}
                                        name="slug"
                                        required
                                        fullWidth
                                        validate={debouncedValidateSlug}
                                    >
                                        {(fieldRenderProps) => {
                                            return (
                                                <FinalFormInput
                                                    {...fieldRenderProps}
                                                    onChange={(event) => {
                                                        setManuallyChangedSlug(true);
                                                        fieldRenderProps.input.onChange(event.target.value);
                                                    }}
                                                    fullWidth
                                                />
                                            );
                                        }}
                                    </Field>
                                )}
                                <FieldContainer
                                    label={intl.formatMessage({
                                        id: "comet.pages.pages.page.path",
                                        defaultMessage: "Complete Path",
                                    })}
                                >
                                    <FormSpy subscription={{ values: true }}>
                                        {({ values }) => {
                                            if (!values.slug) {
                                                return null;
                                            }

                                            if (values.slug === "home") {
                                                return <Typography>/</Typography>;
                                            }

                                            return (
                                                <Typography>
                                                    {parentPath}/{values.slug}
                                                </Typography>
                                            );
                                        }}
                                    </FormSpy>
                                </FieldContainer>
                                <Field
                                    label={intl.formatMessage({
                                        id: "comet.pages.pages.page.documentType",
                                        defaultMessage: "Document Type",
                                    })}
                                    name="documentType"
                                    required
                                    fullWidth
                                >
                                    {(props) => (
                                        <FinalFormSelect {...props} fullWidth>
                                            {options.map((option) => (
                                                <MenuItem value={option.value} key={option.value}>
                                                    {option.label}
                                                </MenuItem>
                                            ))}
                                        </FinalFormSelect>
                                    )}
                                </Field>
                                <Field name="hideInMenu" type="checkbox">
                                    {(props) => (
                                        <FormControlLabel
                                            label={intl.formatMessage({
                                                id: "comet.pages.pages.page.hideInMenu",
                                                defaultMessage: "Hide in Menu",
                                            })}
                                            control={<FinalFormCheckbox {...props} />}
                                        />
                                    )}
                                </Field>
                                {additionalFormFields}
                            </>
                        );
                    }}
                />
            </div>
        );
    }

    return EditPageNode;
}

const isPathAvailableQuery = gql`
    query IsPathAvailable($parentId: ID, $slug: String!, $scope: PageTreeNodeScopeInput!) {
        availability: pageTreeNodeSlugAvailable(parentId: $parentId, slug: $slug, scope: $scope)
    }
`;

const editPageParentNodeQuery = gql`
    query EditPageParentNode($parentId: ID!) {
        pageTreeNode(id: $parentId) {
            id
            path
            slug
        }
    }
`;

const createPageNodeMutation = gql`
    mutation CreatePageNode($input: PageTreeNodeCreateInput!, $contentScope: PageTreeNodeScopeInput!, $category: String!) {
        createPageTreeNode(input: $input, scope: $contentScope, category: $category) {
            id
        }
    }
`;

interface FormValues {
    name: string;
    slug: string;
    path: string;
    documentType: string;
    hideInMenu: boolean;
}

const transformToSlug = (name: string, locale: string) => {
    let slug = slugify(name, { replacement: "-", lower: true, locale });
    // Remove everything except unreserved characters and percent encoding (https://tools.ietf.org/html/rfc3986#section-2.1)
    // This is necessary because slugify does not remove all reserved characters per default (e.g. "@")
    slug = slug.replace(/[^a-zA-Z0-9-._~]/g, "");
    return slug;
};

const isValidSlug = (value: string) => {
    return /^([a-zA-Z0-9-._~]|%[0-9a-fA-F]{2})+$/.test(value);
};

interface InitialValues {
    parent: null | string;
    pos?: number;
}

function unserializeInitialValues(initialValues: string | null = null): InitialValues {
    const ret: InitialValues = {
        parent: null,
        pos: undefined,
    };
    if (!initialValues) {
        return {
            parent: null,
        };
    }
    if (initialValues) {
        try {
            const parsed = JSON.parse(decodeURIComponent(initialValues));

            if ("parent" in parsed && typeof parsed.parent === "string") {
                ret.parent = parsed.parent as string;
            }
            if ("pos" in parsed && typeof parsed.pos === "number") {
                ret.pos = parsed.pos as number;
            }
        } catch (e) {
            // failing to parse the initial-values is ok, we use the defaults in this case
        }
    }

    return ret;
}
