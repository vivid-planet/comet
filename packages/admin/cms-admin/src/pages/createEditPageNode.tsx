import { gql, useApolloClient, useQuery } from "@apollo/client";
import { ErrorScope, Field, FieldContainer, FinalForm, FinalFormCheckbox, FinalFormInput, FinalFormSelect, Loading, Tooltip } from "@comet/admin";
import { Info } from "@comet/admin-icons";
import { Box, Divider, FormControlLabel, IconButton, MenuItem, Typography } from "@mui/material";
import { Mutator } from "final-form";
import setFieldTouched from "final-form-set-field-touched";
import { DocumentNode } from "graphql";
import debounce from "p-debounce";
import React from "react";
import { FormSpy } from "react-final-form";
import { FormattedMessage, useIntl } from "react-intl";
import slugify from "slugify";

import { useContentScope } from "../contentScope/Provider";
import { DocumentInterface, DocumentType } from "../documents/types";
import { SyncFields } from "../form/SyncFields";
import { GQLSlugAvailability } from "../graphql.generated";
import { useLocale } from "../locale/useLocale";
import {
    GQLCreatePageNodeMutation,
    GQLCreatePageNodeMutationVariables,
    GQLEditPageNodeQuery,
    GQLEditPageNodeQueryVariables,
    GQLEditPageParentNodeQuery,
    GQLEditPageParentNodeQueryVariables,
    GQLIsPathAvailableQuery,
    GQLIsPathAvailableQueryVariables,
    GQLUpdatePageNodeMutation,
    GQLUpdatePageNodeMutationVariables,
} from "./createEditPageNode.generated";

type SerializedInitialValues = string;

export interface EditPageNodeFinalFormValues {
    [key: string]: unknown;
}

interface CreateEditPageNodeProps {
    additionalFormFields?: React.ReactNode;
    nodeFragment?: { name: string; fragment: DocumentNode };
    valuesToInput?: (values: EditPageNodeFinalFormValues) => EditPageNodeFinalFormValues;
    disableHideInMenu?: boolean;
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
    disableHideInMenu = false,
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
                numberOfDescendants
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

        React.useEffect(() => {
            apollo.cache.evict({ fieldName: "pageTreeNodeSlugAvailable" });
        }, [apollo.cache]);

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
                    fetchPolicy: "cache-first",
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
        const debouncedValidateSlug = debounce(validateSlug, 500);

        if (mode === "edit" && (loading || !data?.page)) {
            return <Loading />;
        }

        return (
            <div>
                <FinalForm<FormValues>
                    mode={mode}
                    onAfterSubmit={() => {
                        // noop
                    }}
                    mutators={{
                        setFieldTouched: setFieldTouched as Mutator<FormValues>,
                    }}
                    onSubmit={async (values: FormValues) => {
                        let input = {
                            name: values.name,
                            slug: values.slug,
                            hideInMenu: values.hideInMenu,
                            createAutomaticRedirectsOnSlugChange: values.createAutomaticRedirectsOnSlugChange,
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
                                refetchQueries: ["Pages"],
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
                                    variant="horizontal"
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
                                        variant="horizontal"
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
                                                    disableContentTranslation
                                                />
                                            );
                                        }}
                                    </Field>
                                )}

                                <FormSpy subscription={{ values: true, dirtyFields: true }}>
                                    {({ values, dirtyFields }) => {
                                        if (!values.slug) {
                                            return null;
                                        }

                                        const numberOfDescendants = data?.page?.numberOfDescendants ?? 0;

                                        return (
                                            <>
                                                <FieldContainer
                                                    label={intl.formatMessage({
                                                        id: "comet.pages.pages.page.path",
                                                        defaultMessage: "Complete Path",
                                                    })}
                                                    variant="horizontal"
                                                >
                                                    <Typography>
                                                        {values.slug === "home"
                                                            ? "/"
                                                            : parentPath === null
                                                            ? `/${values.slug}`
                                                            : `${parentPath}/${values.slug}`}
                                                    </Typography>
                                                </FieldContainer>
                                                {mode === "edit" && dirtyFields.slug && (
                                                    <Box mt={3}>
                                                        <FieldContainer
                                                            variant="horizontal"
                                                            label={
                                                                <>
                                                                    <FormattedMessage
                                                                        id="comet.pages.pages.page.createAutomaticRedirects.headline"
                                                                        defaultMessage="Redirects"
                                                                    />
                                                                    <Tooltip
                                                                        title={
                                                                            <>
                                                                                <Typography variant="body2">
                                                                                    <strong>
                                                                                        <FormattedMessage
                                                                                            id="comet.pages.pages.page.createAutomaticRedirects.tooltip.title"
                                                                                            defaultMessage="Generate redirects"
                                                                                        />
                                                                                    </strong>
                                                                                </Typography>
                                                                                <Typography variant="body2">
                                                                                    <FormattedMessage
                                                                                        id="comet.pages.pages.page.createAutomaticRedirects.tooltip.text"
                                                                                        defaultMessage="You have changed the slug. Therefore redirects should be created, so that users and search engines automatically land at the correct page, even if they visit the old path. Check this box, if you already have published or shared {numberOfDescendants, plural, =0 {this page} other {these pages}}."
                                                                                        values={{
                                                                                            numberOfDescendants,
                                                                                        }}
                                                                                    />
                                                                                </Typography>
                                                                            </>
                                                                        }
                                                                    >
                                                                        <Box component="span" marginLeft={1}>
                                                                            <IconButton>
                                                                                <Info />
                                                                            </IconButton>
                                                                        </Box>
                                                                    </Tooltip>
                                                                </>
                                                            }
                                                        >
                                                            <Field name="createAutomaticRedirectsOnSlugChange" type="checkbox" initialValue={true}>
                                                                {(props) => (
                                                                    <FormControlLabel
                                                                        label={
                                                                            <Typography display="flex" alignItems="center">
                                                                                <div>
                                                                                    <Typography variant="body1">
                                                                                        <FormattedMessage
                                                                                            tagName="span"
                                                                                            id="comet.pages.pages.page.createAutomaticRedirects.label"
                                                                                            defaultMessage="Create {numberOfDescendants, plural, =0 {a redirect} other {redirects}}"
                                                                                            values={{
                                                                                                numberOfDescendants,
                                                                                            }}
                                                                                        />
                                                                                    </Typography>
                                                                                    {numberOfDescendants > 0 && (
                                                                                        <Typography variant="body2" color="rgba(0, 0, 0, 0.6)">
                                                                                            <FormattedMessage
                                                                                                tagName="span"
                                                                                                id="comet.pages.pages.page.createAutomaticRedirects.labelSubline"
                                                                                                defaultMessage="for this page and all its child pages"
                                                                                            />
                                                                                        </Typography>
                                                                                    )}
                                                                                </div>
                                                                            </Typography>
                                                                        }
                                                                        control={<FinalFormCheckbox {...props} />}
                                                                    />
                                                                )}
                                                            </Field>
                                                        </FieldContainer>
                                                    </Box>
                                                )}
                                            </>
                                        );
                                    }}
                                </FormSpy>

                                <Box marginY={6}>
                                    <Divider />
                                </Box>

                                <Field
                                    label={intl.formatMessage({
                                        id: "comet.pages.pages.page.documentType",
                                        defaultMessage: "Document Type",
                                    })}
                                    name="documentType"
                                    variant="horizontal"
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
                                {!disableHideInMenu && (
                                    <Field
                                        label={intl.formatMessage({
                                            id: "comet.pages.pages.page.menuVisibility",
                                            defaultMessage: "Menu Visibility",
                                        })}
                                        name="hideInMenu"
                                        type="checkbox"
                                        variant="horizontal"
                                    >
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
                                )}

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
    createAutomaticRedirectsOnSlugChange?: boolean;
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
