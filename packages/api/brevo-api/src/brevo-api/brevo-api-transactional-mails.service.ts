import * as Brevo from "@getbrevo/brevo";
import { InjectRepository } from "@mikro-orm/nestjs";
import { EntityRepository } from "@mikro-orm/postgresql";
import { Inject, Injectable } from "@nestjs/common";
import { BrevoConfigInterface } from "src/brevo-config/entities/brevo-config-entity.factory";
import { EmailCampaignScopeInterface } from "src/types";

import { BrevoModuleConfig } from "../config/brevo-module.config";
import { BREVO_MODULE_CONFIG } from "../config/brevo-module.constants";
import { handleBrevoError } from "./brevo-api.utils";
import { BrevoApiEmailTemplateList } from "./dto/brevo-api-email-templates-list";

type SendTransacEmailResponse = ReturnType<Brevo.TransactionalEmailsApi["sendTransacEmail"]>;

@Injectable()
export class BrevoTransactionalMailsService {
    private readonly transactionalEmailsApi = new Map<string, Brevo.TransactionalEmailsApi>();

    constructor(
        @Inject(BREVO_MODULE_CONFIG) private readonly config: BrevoModuleConfig,
        @InjectRepository("BrevoConfig") private readonly brevoConfigRepository: EntityRepository<BrevoConfigInterface>,
    ) {}

    private getTransactionalEmailsApi(scope: EmailCampaignScopeInterface): Brevo.TransactionalEmailsApi {
        try {
            const existingTransactionalEmailsApiForScope = this.transactionalEmailsApi.get(JSON.stringify(scope));

            if (existingTransactionalEmailsApiForScope) {
                return existingTransactionalEmailsApiForScope;
            }

            const { apiKey } = this.config.brevo.resolveConfig(scope);
            const transactionalEmailApi = new Brevo.TransactionalEmailsApi();
            transactionalEmailApi.setApiKey(Brevo.TransactionalEmailsApiApiKeys.apiKey, apiKey);

            this.transactionalEmailsApi.set(JSON.stringify(scope), transactionalEmailApi);

            return transactionalEmailApi;
        } catch (error) {
            handleBrevoError(error);
        }
    }

    async send(options: Omit<Brevo.SendSmtpEmail, "sender">, scope: EmailCampaignScopeInterface): SendTransacEmailResponse {
        try {
            const brevoConfig = await this.brevoConfigRepository.findOneOrFail({ scope });

            return this.getTransactionalEmailsApi(scope).sendTransacEmail({
                ...options,
                sender: { name: brevoConfig.senderName, email: brevoConfig.senderMail },
            });
        } catch (error) {
            handleBrevoError(error);
        }
    }

    public async getEmailTemplates(scope: EmailCampaignScopeInterface): Promise<BrevoApiEmailTemplateList> {
        try {
            const transactionalEmailsApi = this.getTransactionalEmailsApi(scope);
            const { response, body } = await transactionalEmailsApi.getSmtpTemplates(true);

            if (response.statusCode !== 200) {
                throw new Error("Failed to get templates");
            }

            return body as BrevoApiEmailTemplateList;
        } catch (error) {
            handleBrevoError(error);
        }
    }
}
