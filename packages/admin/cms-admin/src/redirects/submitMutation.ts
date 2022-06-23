import { useMutation } from "@apollo/client";
import { ApolloError } from "@apollo/client/errors";

import {
    GQLCreateRedirectInput,
    GQLCreateRedirectMutation,
    GQLRedirectDetailFragment,
    GQLUpdateRedirectInput,
    GQLUpdateRedirectMutation,
} from "../graphql.generated";
import { createRedirectMutation, updateRedirectMutation } from "./RedirectForm.gql";

const convertRedirectFormToApiInput = ({
    sourceType,
    source,
    targetType,
    targetUrl,
    targetPage,
    comment,
}: GQLRedirectDetailFragment): GQLCreateRedirectInput | GQLUpdateRedirectInput => {
    const apiInput: GQLCreateRedirectInput | GQLUpdateRedirectInput = {
        sourceType,
        source,
        targetType,
        comment,
    };

    if (targetType === "extern") {
        apiInput.targetUrl = targetUrl;
        apiInput.targetPageId = null;
    } else if (targetType === "intern" && targetPage) {
        apiInput.targetPageId = targetPage.id;
        apiInput.targetUrl = null;
    }

    apiInput.generationType = "manual";
    return apiInput;
};

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const useSubmitMutation = (
    mode: "edit" | "add",
    id?: string | undefined,
): [(values: GQLRedirectDetailFragment) => void, { loading: boolean; error: ApolloError | undefined }] => {
    const [create, { loading: createLoading, error: createError }] = useMutation<GQLCreateRedirectMutation>(createRedirectMutation);
    const [update, { loading: updateLoading, error: updateError }] = useMutation<GQLUpdateRedirectMutation>(updateRedirectMutation);
    const loading = mode === "edit" ? updateLoading : createLoading;
    const error = mode === "edit" ? updateError : createError;

    return [
        (values: GQLRedirectDetailFragment) => {
            const mutation = mode === "edit" ? update : create;

            const input = convertRedirectFormToApiInput(values);

            return mutation({
                variables: {
                    id,
                    input,
                    lastUpdatedAt: values.updatedAt,
                },
            });
        },
        { loading, error },
    ];
};
