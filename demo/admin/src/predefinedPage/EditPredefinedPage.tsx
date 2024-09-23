import { useApolloClient, useQuery } from "@apollo/client";
import { FinalForm, FinalFormSaveButton, Loading, MainContent, SelectField, Toolbar, ToolbarFillSpace, ToolbarItem, useStackApi } from "@comet/admin";
import { ArrowLeft } from "@comet/admin-icons";
import { PageName } from "@comet/cms-admin";
import { IconButton } from "@mui/material";
import { useMemo } from "react";
import { FormattedMessage } from "react-intl";
import { v4 as uuid } from "uuid";

import { predefinedPageQuery, savePredefinedPageMutation } from "./EditPredefinedPage.gql";
import {
    GQLPredefinedPageQuery,
    GQLPredefinedPageQueryVariables,
    GQLSavePredefinedPageMutation,
    GQLSavePredefinedPageMutationVariables,
} from "./EditPredefinedPage.gql.generated";
import { predefinedPageLabels } from "./predefinedPageLabels";

type FormValues = {
    type?: string;
};

interface Props {
    id: string;
}

export const EditPredefinedPage = ({ id: pageTreeNodeId }: Props) => {
    const stackApi = useStackApi();
    const client = useApolloClient();

    const { data, loading } = useQuery<GQLPredefinedPageQuery, GQLPredefinedPageQueryVariables>(predefinedPageQuery, {
        variables: { pageTreeNodeId },
    });

    const initialValues = useMemo<Partial<FormValues>>(() => {
        if (data?.pageTreeNode?.document) {
            if (data.pageTreeNode.document.__typename !== "PredefinedPage") {
                throw new Error(`Invalid document type: ${data.pageTreeNode.document.__typename}`);
            }

            return {
                type: data.pageTreeNode.document.type ?? undefined,
            };
        }

        return {};
    }, [data]);

    const handleSubmit = async (formValues: FormValues) => {
        const output = {
            type: formValues.type ?? null,
        };

        const id = data?.pageTreeNode?.document?.id ?? uuid();

        await client.mutate<GQLSavePredefinedPageMutation, GQLSavePredefinedPageMutationVariables>({
            mutation: savePredefinedPageMutation,
            variables: { id, input: output, attachedPageTreeNodeId: pageTreeNodeId },
        });
    };

    if (loading) {
        return <Loading behavior="fillPageHeight" />;
    }

    return (
        <FinalForm mode="edit" onSubmit={handleSubmit} initialValues={initialValues}>
            {() => (
                <>
                    <Toolbar>
                        <ToolbarItem>
                            <IconButton onClick={stackApi?.goBack}>
                                <ArrowLeft />
                            </IconButton>
                        </ToolbarItem>
                        <PageName pageId={pageTreeNodeId} />
                        <ToolbarFillSpace />
                        <ToolbarItem>
                            <FinalFormSaveButton />
                        </ToolbarItem>
                    </Toolbar>
                    <MainContent>
                        <SelectField
                            name="type"
                            label={<FormattedMessage id="predefinedPages.type.label" defaultMessage="Type" />}
                            options={[{ value: "News", label: predefinedPageLabels.News }]}
                            fullWidth
                        />
                    </MainContent>
                </>
            )}
        </FinalForm>
    );
};
