import { FileUploadsService } from "@comet/cms-api";
import { FileUploadsConfig } from "@comet/cms-api/lib/file-uploads/file-uploads.config";
import { FILE_UPLOADS_CONFIG } from "@comet/cms-api/lib/file-uploads/file-uploads.constants";
import { DynamicModule, Global, Module, Optional } from "@nestjs/common";
import { ModuleRef } from "@nestjs/core";

import { BlacklistedContactsModule } from "./blacklisted-contacts/blacklisted-contacts.module";
import { BrevoApiModule } from "./brevo-api/brevo-api.module";
import { BrevoConfigModule } from "./brevo-config/brevo-config.module";
import { BrevoConfigEntityFactory } from "./brevo-config/entities/brevo-config-entity.factory";
import { BrevoContactModule } from "./brevo-contact/brevo-contact.module";
import { BrevoEmailImportLogModule } from "./brevo-email-import-log/brevo-email-import-log.module";
import { BrevoModuleConfig } from "./config/brevo-module.config";
import { ConfigModule } from "./config/config.module";
import { EmailCampaignModule } from "./email-campaign/email-campaign.module";
import { TargetGroupModule } from "./target-group/target-group.module";

@Global()
@Module({})
export class BrevoModule {
    constructor(
        private readonly moduleRef: ModuleRef,
        @Optional() private readonly myGlobalService: FileUploadsService,
    ) {
        let fileUploadsConfig: FileUploadsConfig | undefined;
        try {
            fileUploadsConfig = this.moduleRef.get(FILE_UPLOADS_CONFIG, { strict: false });
        } catch {
            throw new Error("FileUploadsModule is an required import for BrevoModule");
        }

        if (fileUploadsConfig && !fileUploadsConfig.acceptedMimeTypes.includes("text/csv")) {
            throw new Error("BrevoModule requires mime type 'text/csv' in FileUploadsModule's config");
        }
    }
    static register(config: BrevoModuleConfig): DynamicModule {
        const BrevoConfig = BrevoConfigEntityFactory.create({
            Scope: config.emailCampaigns.Scope,
        });

        const imports = [
            BrevoApiModule,
            BrevoContactModule.register({
                BrevoContactAttributes: config.brevo.BrevoContactAttributes,
                Scope: config.emailCampaigns.Scope,
                BrevoTargetGroup: config.brevo.TargetGroup,
                BlacklistedContacts: config.brevo.BlacklistedContacts,
                BrevoEmailImportLog: config.brevo.BrevoEmailImportLog,
            }),
            EmailCampaignModule.register({
                EmailCampaignContentBlock: config.emailCampaigns.EmailCampaignContentBlock,
                Scope: config.emailCampaigns.Scope,
                BrevoTargetGroup: config.brevo.TargetGroup,
                BrevoEmailCampaign: config.brevo.EmailCampaign,
                BrevoConfig,
            }),
            TargetGroupModule.register({
                Scope: config.emailCampaigns.Scope,
                BrevoFilterAttributes: config.brevo.BrevoContactFilterAttributes,
                BrevoTargetGroup: config.brevo.TargetGroup,
            }),
            BrevoConfigModule.register({ BrevoConfig, Scope: config.emailCampaigns.Scope }),
            ConfigModule.forRoot(config),
        ];

        if (config.brevo.BlacklistedContacts) {
            imports.push(
                BlacklistedContactsModule.register({
                    Scope: config.emailCampaigns.Scope,
                    BrevoBlacklistedContacts: config.brevo.BlacklistedContacts,
                }),
            );
        }

        if (config.brevo.BrevoEmailImportLog) {
            imports.push(
                BrevoEmailImportLogModule.register({
                    Scope: config.emailCampaigns.Scope,
                    BrevoEmailImportLog: config.brevo.BrevoEmailImportLog,
                }),
            );
        }

        return {
            module: BrevoModule,
            imports,
            exports: [
                TargetGroupModule,
                BrevoContactModule,
                BrevoApiModule,
                ...(config.brevo.BlacklistedContacts ? [BlacklistedContactsModule] : []),
                ...(config.brevo.BrevoEmailImportLog ? [BrevoEmailImportLogModule] : []),
            ],
        };
    }
}
