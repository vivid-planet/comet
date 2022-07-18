import { useMutation } from "@apollo/client";
import { ApolloError } from "@apollo/client/errors";
import { BlockInterface } from "@comet/blocks-admin";

import { GQLCreateRedirectMutation, GQLRedirectInput, GQLUpdateRedirectMutation } from "../graphql.generated";
import { FormValues } from "./RedirectForm";
import { createRedirectMutation, updateRedirectMutation } from "./RedirectForm.gql";

const convertRedirectFormToApiInput = ({ sourceType, source, target, comment }: FormValues, linkBlock: BlockInterface): GQLRedirectInput => {
    const apiInput: GQLRedirectInput = {
        sourceType,
        source,
        target: linkBlock.state2Output(target),
        comment,
        generationType: "manual",
    };

    return apiInput;
};

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const useSubmitMutation = (
    mode: "edit" | "add",
    id: string | undefined,
    linkBlock: BlockInterface,
): [(values: FormValues) => void, { loading: boolean; error: ApolloError | undefined }] => {
    const [create, { loading: createLoading, error: createError }] = useMutation<GQLCreateRedirectMutation>(createRedirectMutation);
    const [update, { loading: updateLoading, error: updateError }] = useMutation<GQLUpdateRedirectMutation>(updateRedirectMutation);
    const loading = mode === "edit" ? updateLoading : createLoading;
    const error = mode === "edit" ? updateError : createError;

    return [
        (values: FormValues) => {
            const mutation = mode === "edit" ? update : create;

            const input = convertRedirectFormToApiInput(values, linkBlock);

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
