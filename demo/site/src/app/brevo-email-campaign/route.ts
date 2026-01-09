import { renderToMjml } from "@faire/mjml-react/utils/renderToMjml";
import { generateMjmlMailContent } from "@src/app/brevo-email-campaign/generateMjmlMailContent";
import { getEmailCampaignConfigFromEnvVariables } from "@src/brevo/util/getEmailCampaignConfigFromEnvVariables";
import { loadMessages } from "@src/util/loadMessages";
import { type ReactElement } from "react";
import { z } from "zod";

export const runtime = "nodejs";

async function renderReactToHtml(email: ReactElement) {
    // mjml2html is CJS-ish; importing dynamically is usually the least painful
    const { default: mjml2html } = await import("mjml");
    return mjml2html(renderToMjml(email), { validationLevel: "soft" });
}

const RequestQueryValidationSchema = z.object({
    content: z.object({ blocks: z.array(z.any()) }),
    scope: z.object({ domain: z.string(), language: z.string() }),
});

export async function POST(request: Request) {
    const requestBody = await request.json();
    const validationResult = RequestQueryValidationSchema.safeParse(requestBody);

    if (!validationResult.success) {
        return new Response("Sent data not valid", { status: 400 });
    }

    const params = validationResult.data;
    const messages = await loadMessages(params.scope.language);

    const { html, errors } = await renderReactToHtml(
        generateMjmlMailContent(params.content, { locale: params.scope.language, messages }, getEmailCampaignConfigFromEnvVariables()),
    );

    if (errors?.length > 0) {
        return Response.json({ errors }, { status: 400 });
    }

    return new Response(html, {
        headers: { "Content-Type": "text/html; charset=utf-8" },
    });
}
