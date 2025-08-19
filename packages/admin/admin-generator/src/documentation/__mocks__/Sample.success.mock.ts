import { delay, graphql, HttpResponse } from "msw";

import { type GQLSamplesGridQuery, type GQLSamplesGridQueryVariables } from "../generated/Sample.generated";

export const sampleSuccessMock = graphql.query<GQLSamplesGridQuery, GQLSamplesGridQueryVariables>("SamplesGrid", async () => {
    await delay(100);

    return HttpResponse.json({
        data: {
            __typename: "Query",
            samples: {
                __typename: "PaginatedSamples",
                totalCount: 1,
                nodes: [
                    {
                        __typename: "Sample",
                        id: "1",
                        sample: "Sample 1",
                    },
                ],
            },
        },
    });
});
