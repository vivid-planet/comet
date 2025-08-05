import { MailTemplate, MailTemplateInterface } from "@comet/cms-api";

@MailTemplate()
export class ProductPublishedMail implements MailTemplateInterface<unknown> {
    id = "products-published";
    type = "products";
    name = "Products published";

    async generateMail(): Promise<{
        subject: string;
        text: string;
        html: string;
    }> {
        return {
            subject: "All products have been published",
            text: "All products have been published",
            html: "<p>All products have been published</p>",
        };
    }

    async getPreparedTestParams() {
        return [];
    }
}
