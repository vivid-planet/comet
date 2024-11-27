import { gql, previewParams } from "@comet/cms-site";
import { FormBuilderBlock } from "@src/form-builder/blocks/FormBuilderBlock";
import { createGraphQLFetch } from "@src/util/graphQLClient";
import { notFound } from "next/navigation";

import { GQLFormBuilderQuery, GQLFormBuilderQueryVariables } from "./page.generated";

export default async function NewsDetailPage({ params }: { params: { id: string; lang: string } }) {
    const { previewData } = (await previewParams()) || { previewData: undefined };
    const graphqlFetch = createGraphQLFetch(previewData);

    const data = await graphqlFetch<GQLFormBuilderQuery, GQLFormBuilderQueryVariables>(formBuilderQuery, {
        id: params.id,
    });

    if (data.formBuilder === null) {
        notFound();
    }

    return (
        <FormBuilderBlock data={data.formBuilder.blocks} submitButtonText={data.formBuilder.submitButtonText ?? ""} formId={data.formBuilder.id} />
    );
}

// TODO: Scope????
const formBuilderQuery = gql`
    query FormBuilder($id: ID!) {
        formBuilder(id: $id) {
            id
            name
            submitButtonText
            blocks
        }
    }
`;
