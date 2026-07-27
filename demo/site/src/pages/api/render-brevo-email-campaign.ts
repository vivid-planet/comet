import { getEmailCampaignConfig } from "@src/brevo/util/getEmailCampaignConfig";
import { renderMailContentAsMjml } from "@src/brevo/util/renderMailContentAsMjml";
import { replaceMailHtmlPlaceholders } from "@src/brevo/util/replaceMailHtmlPlaceholders";
import { loadMessages } from "@src/util/loadMessages";
import mjml2html from "mjml";
import type { NextApiRequest, NextApiResponse } from "next";
import { z } from "zod";

const RequestBodyValidationSchema = z.object({
    content: z.object({ blocks: z.array(z.any()) }),
    scope: z.object({ domain: z.string(), language: z.string() }),
});

export default async function handler(req: NextApiRequest, res: NextApiResponse): Promise<void> {
    if (req.method !== "POST") {
        res.setHeader("Allow", "POST");
        res.status(405).end();
        return;
    }

    const validationResult = RequestBodyValidationSchema.safeParse(req.body);
    if (!validationResult.success) {
        res.status(400).send("Sent data not valid");
        return;
    }

    const { content, scope } = validationResult.data;
    const messages = await loadMessages(scope.language);

    const mjml = renderMailContentAsMjml(content, { locale: scope.language, messages }, getEmailCampaignConfig(scope));
    const { html } = mjml2html(mjml, { validationLevel: "soft" });
    const outputHtml = replaceMailHtmlPlaceholders(html, "mail");

    res.setHeader("Content-Type", "text/html; charset=utf-8");
    res.status(200).send(outputHtml);
}
