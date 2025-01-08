import { useApolloClient } from "@apollo/client";
import {
    Field,
    FinalForm,
    MainContent,
    SaveBoundary,
    SaveBoundarySaveButton,
    StackToolbar,
    TextField,
    ToolbarActions,
    ToolbarAutomaticTitleItem,
    ToolbarBackButton,
    ToolbarFillSpace,
} from "@comet/admin";
import { Preview } from "@comet/admin-icons";
import { AdminComponentRoot, AdminTabLabel, BlockState, createFinalFormBlock } from "@comet/blocks-admin";
import {
    BlockPreviewWithTabs,
    openSitePreviewWindow,
    resolveHasSaveConflict,
    useBlockPreview,
    useCmsBlockContext,
    useContentScope,
    useEditState,
    useSaveConflictQuery,
    useSiteConfig,
} from "@comet/cms-admin";
import { Button } from "@mui/material";
import { GQLFormBuilderInput } from "@src/graphql.generated";
import isEqual from "lodash.isequal";
import { Fragment } from "react";
import { FormattedMessage, useIntl } from "react-intl";
import { useRouteMatch } from "react-router-dom";

import { FormBuilderBlock } from "./blocks/FormBuilderBlock";
import { FormStackPageTitle } from "./FormBuilderFormStackPageTitle";
import { checkForChangesQuery, formBuilderDetailQuery, updateFormBuilderMutation } from "./FormBuilderPreviewAndForm.gql";
import {
    GQLCheckForChangesFormBuilderQuery,
    GQLCheckForChangesFormBuilderQueryVariables,
    GQLFormBuilderDetailQuery,
    GQLFormBuilderDetailQueryVariables,
    GQLUpdateFormBuilderMutation,
    GQLUpdateFormBuilderMutationVariables,
} from "./FormBuilderPreviewAndForm.gql.generated";

interface FormBuilderPreviewAndFormProps {
    // TODO: Make id required and hardcode mode as "edit"
    id?: string;
    mode: "edit" | "add";
}

const rootBlocks = {
    blocks: FormBuilderBlock,
};

type FormBuilderState = GQLFormBuilderInput & {
    [key in keyof typeof rootBlocks]: BlockState<(typeof rootBlocks)[key]>;
};

type FormBuilderOutput = GQLFormBuilderInput;

export default function FormBuilderPreviewAndForm({ id, mode }: FormBuilderPreviewAndFormProps) {
    if (mode == "edit" && !id) throw new Error("id is required for mode edit");

    const { match: contentScopeMatch } = useContentScope();
    const client = useApolloClient();
    const formBuilderBasePath = "form-builder";

    const { state, hasChanges, query } = useEditState<
        GQLFormBuilderDetailQuery,
        GQLFormBuilderDetailQueryVariables,
        FormBuilderState,
        FormBuilderOutput
    >({
        mode,
        query: formBuilderDetailQuery,
        variables: id ? { id } : undefined,
        input2State: ({ formBuilder }) => ({
            name: formBuilder.name,
            submitButtonText: formBuilder.submitButtonText,
            blocks: FormBuilderBlock.input2State(formBuilder.blocks),
        }),
        state2Output: (state) => ({
            ...state,
            submitButtonText: state.submitButtonText,
            blocks: FormBuilderBlock.state2Output(state.blocks),
        }),
        defaultState: {
            name: "",
            submitButtonText: "",
            blocks: FormBuilderBlock.defaultValues(),
        },
    });

    const saveConflict = useSaveConflictQuery<GQLCheckForChangesFormBuilderQuery, GQLCheckForChangesFormBuilderQueryVariables>(
        checkForChangesQuery,
        {
            variables: {
                id: id as string,
            },
            resolveHasConflict: (data) => {
                return resolveHasSaveConflict(query.data?.formBuilder?.updatedAt, data?.formBuilder?.updatedAt);
            },
            skip: false,
        },
        {
            hasChanges,
            loadLatestVersion: async () => {
                await query.refetch();
            },
            onDiscardButtonPressed: async () => {
                await query.refetch();
            },
        },
    );

    const handleSubmit = async (formValues: FormBuilderState) => {
        if (!id) throw new Error("id is required"); // TODO: IS THIS REQUIRED??

        if (await saveConflict.checkForConflicts()) throw new Error("Conflicts detected");
        const output: GQLFormBuilderInput = {
            ...formValues,
        };

        output.blocks = FormBuilderBlock.state2Output(formValues.blocks);

        await client.mutate<GQLUpdateFormBuilderMutation, GQLUpdateFormBuilderMutationVariables>({
            mutation: updateFormBuilderMutation,
            variables: { id, input: output },
        });
    };

    if (!state) {
        return null;
    }

    return (
        <SaveBoundary>
            <FormStackPageTitle formBuilderId={id}>
                <StackToolbar>
                    <ToolbarBackButton />
                    <ToolbarAutomaticTitleItem />
                    <ToolbarFillSpace />
                    <ToolbarActions>
                        <Button
                            startIcon={<Preview />}
                            color="info"
                            onClick={() => {
                                openSitePreviewWindow(`/${formBuilderBasePath}/${id}`, contentScopeMatch.url);
                            }}
                        >
                            <FormattedMessage id="generic.preview" defaultMessage="Web preview" />
                        </Button>
                        <SaveBoundarySaveButton />
                    </ToolbarActions>
                </StackToolbar>
            </FormStackPageTitle>
            <MainContent disablePaddingBottom>
                <FinalForm<FormBuilderState>
                    mode="edit"
                    onSubmit={handleSubmit}
                    initialValuesEqual={isEqual}
                    initialValues={{
                        name: state.name,
                        submitButtonText: state.submitButtonText,
                        blocks: state.blocks,
                    }}
                >
                    {({ values }) => <FormAndPreview state={values} />}
                </FinalForm>
            </MainContent>
            {saveConflict.dialogs}
        </SaveBoundary>
    );
}

const FFFormBuilderBlock = createFinalFormBlock(FormBuilderBlock);

type FormContentProps = {
    state: FormBuilderState;
};

const FormAndPreview = ({ state }: FormContentProps) => {
    const intl = useIntl();
    const { scope } = useContentScope();
    const siteConfig = useSiteConfig({ scope });
    const blockContext = useCmsBlockContext();
    const previewApi = useBlockPreview();
    const match = useRouteMatch();

    const previewContext = {
        ...blockContext,
        parentUrl: match.url,
        showVisibleOnly: previewApi.showOnlyVisible,
    };

    const previewUrl = `${siteConfig.blockPreviewBaseUrl}/form-builder`;
    const previewState = {
        ...FormBuilderBlock.createPreviewState(state.blocks, {
            ...previewContext,
            parentUrl: `${match.url}/blocks`,
        }),
        submitButtonText: state.submitButtonText,
    };

    return (
        <BlockPreviewWithTabs previewUrl={previewUrl} previewState={previewState} previewApi={previewApi}>
            {[
                {
                    key: "settings",
                    label: (
                        <AdminTabLabel isValid={() => true}>
                            <FormattedMessage id="formBuilder.form.settings" defaultMessage="Settings" />
                        </AdminTabLabel>
                    ),
                    content: (
                        <>
                            <TextField
                                name="name"
                                fullWidth
                                label={intl.formatMessage({ id: "formBuilder.name", defaultMessage: "Name" })}
                                required
                            />
                            <TextField
                                name="submitButtonText"
                                fullWidth
                                label={intl.formatMessage({ id: "formBuilder.submitButtonText", defaultMessage: "Submit button text" })}
                            />
                        </>
                    ),
                },
                {
                    key: "blocks",
                    label: (
                        <AdminTabLabel isValid={() => true}>
                            <FormattedMessage id="generic.blocks" defaultMessage="Blocks" />
                        </AdminTabLabel>
                    ),
                    content: (
                        <AdminComponentRoot>
                            <Field name="blocks" isEqual={isEqual} component={FFFormBuilderBlock} fullWidth />
                        </AdminComponentRoot>
                    ),
                },
            ]}
        </BlockPreviewWithTabs>
    );
};
