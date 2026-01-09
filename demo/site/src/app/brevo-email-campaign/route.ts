import { renderToMjml } from "@faire/mjml-react/utils/renderToMjml";
import { generateMjmlMailContent } from "@src/app/brevo-email-campaign/generateMjmlMailContent";
import { type ReactElement } from "react";

export const runtime = "nodejs";

async function renderReactToHtml(email: ReactElement) {
    // mjml2html is CJS-ish; importing dynamically is usually the least painful
    const { default: mjml2html } = await import("mjml");
    return mjml2html(renderToMjml(email), { validationLevel: "soft" });
}

export async function POST() {
    const { html, errors } = await renderReactToHtml(generateMjmlMailContent({ blocks: [] }, { locale: "en", messages: {} }));

    if (errors?.length) {
        return Response.json({ errors }, { status: 400 });
    }

    return new Response(html, {
        headers: { "Content-Type": "text/html; charset=utf-8" },
    });
}

// const requestQueryValidationSchema = z.object({
//     content: z.object({ blocks: z.array(z.any()) }),
//     title: z.string(),
//     scope: z.object({ domain: z.string(), language: z.string() }),
// });
//
// export async function POST(request: Request) {
//     console.log("kdjflkdjfk");
//
//     // Add authentication here if needed, else this is a public endpoint
//     const validationResult = requestQueryValidationSchema.safeParse(request.body);
//
//     if (!validationResult.success) {
//         return new Response("Sent data not valid", { status: 400 });
//     }
//
//     return new Response("Hallo");
//
//     const { content, scope } = await request.json();
//
//     const messages = await loadMessages(scope.language);
//     const mjmlContent = generateMjmlMailContent(content, { locale: scope.language, messages });
//     const { html } = mjml2html(mjmlContent);
//
//     return new Response(html);
// }
