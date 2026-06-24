import { graphql, HttpResponse } from "msw";

export const buildTemplatesHandler = graphql.query("BuildTemplates", () => {
    return HttpResponse.json({
        data: {
            buildTemplates: Array.from({ length: 8 }, (_, i) => ({
                __typename: "BuildTemplate",
                id: `template-${i + 1}`,
                name: `scope-${i + 1}`,
                label: `Scope ${i + 1}`,
            })),
        },
    });
});
