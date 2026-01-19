import { getEmailCampaignConfig } from "@src/brevo/util/getEmailCampaignConfig";
import { renderMailContentAsMjml } from "@src/brevo/util/renderMailContentAsMjml";
import { replaceMailHtmlPlaceholders } from "@src/brevo/util/replaceMailHtmlPlaceholders";
import { loadMessages } from "@src/util/loadMessages";
import { z } from "zod";

export const runtime = "nodejs";

const RequestQueryValidationSchema = z.object({
    content: z.object({ blocks: z.array(z.any()) }),
});

export async function POST(request: Request, { params: { domain, language } }: { params: { domain: string; language: string } }) {
    const requestBody = await request.json();
    const validationResult = RequestQueryValidationSchema.safeParse(requestBody);

    if (!validationResult.success) {
        return new Response("Sent data not valid", { status: 400 });
    }

    const params = validationResult.data;
    const messages = await loadMessages(language);

    const { html, errors } = await convertMjmlToHtml(
        renderMailContentAsMjml(params.content, { locale: language, messages }, getEmailCampaignConfig({ domain, language })),
    );
    const outputHtml = replaceMailHtmlPlaceholders(html, "mail");

    if (errors?.length > 0) {
        return Response.json({ errors }, { status: 400 });
    }

    return new Response(outputHtml, {
        headers: { "Content-Type": "text/html; charset=utf-8" },
    });
}

async function convertMjmlToHtml(mjml: string) {
    // mjml2html only works when importing it dynamically, something to do with CommonJS
    const { default: mjml2html } = await import("mjml");
    return mjml2html(mjml, { validationLevel: "soft" });
}
