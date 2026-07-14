import type { WelcomeEmailContentBlockData } from "@src/blocks.generated";
import { createGraphQLFetch } from "@src/util/graphQLClient";
import { loadMessages } from "@src/util/loadMessages";
import { recursivelyLoadBlockData } from "@src/util/recursivelyLoadBlockData";
import { getWelcomeEmailConfig } from "@src/welcomeEmail/util/getWelcomeEmailConfig";
import { renderWelcomeEmailAsMjml } from "@src/welcomeEmail/util/renderWelcomeEmailAsMjml";
import mjml2html from "mjml";
import type { NextApiRequest, NextApiResponse } from "next";
import { z } from "zod";

const QueryValidationSchema = z.object({
    domain: z.string(),
    language: z.string(),
});

const welcomeEmailQuery = `
    query WelcomeEmailForRender($scope: WelcomeEmailScopeInput!) {
        welcomeEmail(scope: $scope) {
            content
        }
    }
`;

export default async function handler(req: NextApiRequest, res: NextApiResponse): Promise<void> {
    if (req.method !== "GET") {
        res.setHeader("Allow", "GET");
        res.status(405).end();
        return;
    }

    const validationResult = QueryValidationSchema.safeParse(req.query);
    if (!validationResult.success) {
        res.status(400).send("Invalid scope");
        return;
    }
    const scope = validationResult.data;

    const graphQLFetch = createGraphQLFetch();
    const { welcomeEmail } = await graphQLFetch<{ welcomeEmail: { content: WelcomeEmailContentBlockData } | null }, { scope: typeof scope }>(
        welcomeEmailQuery,
        { scope },
    );

    if (!welcomeEmail) {
        res.status(404).send("No welcome email found for the given scope");
        return;
    }

    const content = await recursivelyLoadBlockData({
        blockType: "WelcomeEmailContent",
        blockData: welcomeEmail.content,
        graphQLFetch,
        fetch,
        scope,
    });

    const messages = await loadMessages(scope.language);
    const mjml = renderWelcomeEmailAsMjml(content, { locale: scope.language, messages }, getWelcomeEmailConfig(scope));
    const { html } = mjml2html(mjml, { validationLevel: "soft" });

    res.setHeader("Content-Type", "text/html; charset=utf-8");
    res.setHeader("Cache-Control", "no-store");
    res.status(200).send(html);
}
