import { gql, useApolloClient, useQuery } from "@apollo/client";
import {
    Field,
    FillSpace,
    FinalForm,
    FinalFormInput,
    FinalFormSaveButton,
    FinalFormSelect,
    Loading,
    MainContent,
    Toolbar,
    ToolbarActions,
    ToolbarBackButton,
    ToolbarTitleItem,
    useStackSwitchApi,
} from "@comet/admin";
import { MenuItem } from "@mui/material";
import isEqual from "lodash.isequal";
import { type JSX, useMemo } from "react";
import { FormattedMessage, useIntl } from "react-intl";

import { createFinalFormBlock } from "../blocks/form/createFinalFormBlock";
import { type BlockInterface, type BlockState } from "../blocks/types";
import { isValidUrl } from "../blocks/validators/isValidUrl";
import { ContentScopeIndicator } from "../contentScope/ContentScopeIndicator";
import { type GQLRedirectSourceTypeValues } from "../graphql.generated";
import { type GQLRedirectSourceAvailableQuery, type GQLRedirectSourceAvailableQueryVariables } from "./RedirectForm.generated";
import { redirectDetailQuery } from "./RedirectForm.gql";
import {
    type GQLCreateRedirectMutation,
    type GQLRedirectDetailFragment,
    type GQLRedirectDetailQuery,
    type GQLRedirectDetailQueryVariables,
} from "./RedirectForm.gql.generated";
import { useSubmitMutation } from "./submitMutation";

export { createRedirectMutation, updateRedirectMutation } from "./RedirectForm.gql";
export type { GQLCreateRedirectMutation, GQLUpdateRedirectMutation } from "./RedirectForm.gql.generated";

interface Props {
    id?: string;
    mode: "edit" | "add";
    linkBlock: BlockInterface;
    scope: Record<string, unknown>;
}

export interface FormValues {
    sourceType: GQLRedirectSourceTypeValues;
    source: string;
    target: BlockState<BlockInterface>;
    comment?: string;
    updatedAt?: string;
}

const useInitialValues = (id: string | undefined, linkBlock: BlockInterface): FormValues | undefined => {
    const { data } = useQuery<GQLRedirectDetailQuery, GQLRedirectDetailQueryVariables>(redirectDetailQuery, {
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        variables: { id: id! },
        skip: !id,
    });

    if (id === undefined) {
        return {
            sourceType: "path",
            source: "",
            target: linkBlock.defaultValues(),
        };
    }

    if (!data) {
        return undefined;
    }

    const { redirect } = data;

    return {
        sourceType: redirect.sourceType,
        source: redirect.source,
        target: linkBlock.input2State(redirect.target),
        comment: redirect.comment ?? undefined,
        updatedAt: redirect.updatedAt,
    };
};

export const RedirectForm = ({ mode, id, linkBlock, scope }: Props): JSX.Element => {
    const intl = useIntl();
    const initialValues = useInitialValues(id, linkBlock);
    const targetInput = useMemo(() => createFinalFormBlock(linkBlock), [linkBlock]);
    const client = useApolloClient();
    const stackSwitchApi = useStackSwitchApi();

    const sourceTypeOptions = [
        {
            value: "path",
            label: intl.formatMessage({
                id: "comet.pages.redirects.redirect.source.type.path",
                defaultMessage: "Path",
            }),
        },
    ];

    const [submit] = useSubmitMutation(mode, id, linkBlock, scope);

    if (mode === "edit" && initialValues === undefined) {
        return <Loading behavior="fillPageHeight" />;
    }

    const isRedirectSourceAvailable = async (newRedirectSource: string): Promise<boolean> => {
        if (newRedirectSource === initialValues?.source) {
            return true;
        }

        const { data } = await client.query<GQLRedirectSourceAvailableQuery, GQLRedirectSourceAvailableQueryVariables>({
            query: gql`
                query RedirectSourceAvailable($scope: RedirectScopeInput!, $source: String!) {
                    redirectSourceAvailable(scope: $scope, source: $source)
                }
            `,
            variables: {
                scope,
                source: newRedirectSource,
            },
            fetchPolicy: "network-only",
        });

        return data.redirectSourceAvailable;
    };

    const validateSource = async (value: string, allValues: GQLRedirectDetailFragment) => {
        if (allValues.sourceType === "path") {
            if (!value.startsWith("/")) {
                return <FormattedMessage id="comet.pages.redirects.validate.path.error" defaultMessage="Needs to start with /" />;
            } else if (!/^\/([a-zA-Z0-9-._~/:?=&]|%[0-9a-fA-F]{2})+$/.test(value)) {
                return <FormattedMessage id="comet.pages.redirects.validate.path.invalidPathError" defaultMessage="Invalid path" />;
            }

            if (!(await isRedirectSourceAvailable(value))) {
                return (
                    <FormattedMessage
                        id="comet.redirects.form.validation.sourceTaken"
                        defaultMessage="Source {source} is not available"
                        values={{ source: value }}
                    />
                );
            }
        } else {
            return validateDomain(value);
        }
    };

    const validateDomain = (value: string) => {
        if (!isValidUrl(value)) {
            return intl.formatMessage({
                id: "comet.pages.redirects.validate.domain.error",
                defaultMessage: "Needs to start with http:// or https://",
            });
        }
    };

    const handleSaveClick = async (values: FormValues) => {
        const response = await submit(values);
        if (response.data && "createRedirect" in response.data) {
            setTimeout(() => {
                stackSwitchApi.activatePage("edit", (response.data as GQLCreateRedirectMutation).createRedirect.id);
            });
        }
    };

    return (
        <FinalForm
            mode={mode}
            onSubmit={handleSaveClick}
            initialValues={initialValues}
            renderButtons={() => null}
            onAfterSubmit={(values, form) => {
                form.reset(values);
            }}
            initialValuesEqual={isEqual}
        >
            {({ values, pristine, hasValidationErrors, submitting, handleSubmit, validating }) => (
                <>
                    <Toolbar scopeIndicator={<ContentScopeIndicator scope={scope} />}>
                        <ToolbarBackButton />
                        <ToolbarTitleItem>
                            {values.source ? values.source : <FormattedMessage id="comet.redirects.defaultTitle" defaultMessage="Redirect Detail" />}
                        </ToolbarTitleItem>
                        <FillSpace />
                        <ToolbarActions>
                            <FinalFormSaveButton />
                        </ToolbarActions>
                    </Toolbar>
                    <MainContent>
                        <Field
                            label={intl.formatMessage({
                                id: "comet.pages.redirects.redirect.source.type",
                                defaultMessage: "Source type",
                            })}
                            name="sourceType"
                            required
                            fullWidth
                        >
                            {(props) => (
                                <FinalFormSelect {...props} fullWidth>
                                    {sourceTypeOptions.map((option) => (
                                        <MenuItem value={option.value} key={option.value}>
                                            {option.label}
                                        </MenuItem>
                                    ))}
                                </FinalFormSelect>
                            )}
                        </Field>
                        <Field
                            label={intl.formatMessage({ id: "comet.pages.redirects.redirect.source", defaultMessage: "Source" })}
                            name="source"
                            required
                            component={FinalFormInput}
                            // @TODO: FIX ts-type here: https://github.com/vivid-planet/comet-admin/blob/next/packages/admin/src/form/Field.tsx#L18
                            // type object doesnt work with "strict"
                            // eslint-disable-next-line @typescript-eslint/no-explicit-any
                            validate={validateSource as any}
                            fullWidth
                            placeholder="/example-path"
                            disableContentTranslation
                        />
                        <Field
                            name="target"
                            label={intl.formatMessage({
                                id: "comet.pages.redirects.redirect.target",
                                defaultMessage: "Target",
                            })}
                            required
                            fullWidth
                            component={targetInput}
                        />
                        <Field
                            label={intl.formatMessage({ id: "comet.pages.redirects.redirect.comment", defaultMessage: "Comment" })}
                            name="comment"
                            component={FinalFormInput}
                            fullWidth
                        />
                    </MainContent>
                </>
            )}
        </FinalForm>
    );
};
