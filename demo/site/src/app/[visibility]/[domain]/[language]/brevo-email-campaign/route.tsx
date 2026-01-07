import { generateMjmlMailContent } from "@src/brevo/components/RenderedMail";
import { loadMessages } from "@src/util/loadMessages";
import mjml2html from "mjml";
import { z } from "zod";

const requestQueryValidationSchema = z.object({
    content: z.object({ blocks: z.array(z.any()) }),
    title: z.string(),
    scope: z.object({ domain: z.string(), language: z.string() }),
});

export default async function POST(request: Request) {
    // Add authentication here if needed, else this is a public endpoint
    const validationResult = requestQueryValidationSchema.safeParse(request.body);

    if (!validationResult.success) {
        return new Response("Sent data not valid", { status: 400 });
    }

    const { content, scope } = await request.json();

    const messages = await loadMessages(scope.language);
    const mjmlContent = generateMjmlMailContent(content, { locale: scope.language, messages });
    const { html } = mjml2html(mjmlContent);

    return new Response(html);
}
