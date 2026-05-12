import { registerAdditionalPermissions } from "@comet/cms-api";
import { registerEnumType } from "@nestjs/graphql";

export enum BrevoPermission {
    brevoNewsletterConfig = "brevoNewsletterConfig",
    brevoNewsletter = "brevoNewsletter",
}

registerEnumType(BrevoPermission, {
    name: "BrevoPermission",
});

registerAdditionalPermissions(BrevoPermission);
