import { type Block } from "@comet/cms-api";
import { type Type } from "@nestjs/common";
import { type EmailCampaignInterface } from "src/email-campaign/entities/email-campaign-entity.factory";
import { type TargetGroupInterface } from "src/target-group/entity/target-group-entity.factory";
import { type BrevoContactAttributesInterface, type EmailCampaignScopeInterface } from "src/types";

import { type BlacklistedContactsInterface } from "../blacklisted-contacts/entity/blacklisted-contacts.entity.factory";
import { type BrevoEmailImportLogInterface } from "../brevo-email-import-log/entity/brevo-email-import-log.entity.factory";
import { type BrevoContactFilterAttributesInterface } from "../types";

export interface BrevoModuleConfig {
    brevo: {
        resolveConfig: (scope: EmailCampaignScopeInterface) => {
            apiKey: string;
            redirectUrlForImport: string;
        };
        BlacklistedContacts?: Type<BlacklistedContactsInterface>;
        BrevoContactAttributes?: Type<BrevoContactAttributesInterface>;
        BrevoContactFilterAttributes?: Type<BrevoContactFilterAttributesInterface>;
        EmailCampaign: Type<EmailCampaignInterface>;
        TargetGroup: Type<TargetGroupInterface>;
        BrevoEmailImportLog?: Type<BrevoEmailImportLogInterface>;
    };
    ecgRtrList: {
        apiKey: string;
    };
    emailCampaigns: {
        Scope: Type<EmailCampaignScopeInterface>;
        EmailCampaignContentBlock: Block;
        resolveFrontendConfig: (scope: EmailCampaignScopeInterface) => {
            frontend: {
                url: string;
                basicAuth: {
                    username: string;
                    password: string;
                };
            };
        };
    };
    contactsWithoutDoi?: {
        allowAddingContactsWithoutDoi?: boolean;
        emailHashKey?: string;
    };
}
