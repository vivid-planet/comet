import { DiscoveryService } from "@golevelup/nestjs-discovery";
import { EntityManager } from "@mikro-orm/postgresql";
import { Injectable } from "@nestjs/common";
import { Options as MailOptions } from "nodemailer/lib/mailer";

import { MailerService } from "../mailer/mailer.service";
import { MAIL_TEMPLATE_METADATA_KEY, MailTemplateMetadata } from "./mail-template.decorator";

export type MailTemplateInterface<T> = {
    id: string;
    type: string;
    name: string;

    generateMail: (params: T) => Promise<MailOptions>;
    getPreparedTestParams: () => Promise<PreparedTestParams<T>[]>;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function isMailTemplate(arg: any): arg is MailTemplateInterface<unknown> {
    return (
        arg.id !== undefined &&
        arg.type !== undefined &&
        arg.name !== undefined &&
        arg.generateMail !== undefined &&
        typeof arg.generateMail === "function"
    );
}
export type PreparedTestParams<T> = {
    name: string;
    params: T;
};

@Injectable()
export class MailTemplateService {
    constructor(
        private readonly entityManager: EntityManager,
        private readonly mailerService: MailerService,
        private readonly discoveryService: DiscoveryService,
    ) {}

    async getMailTemplates(filter?: { type?: string }): Promise<MailTemplateInterface<unknown>[]> {
        const { type } = filter || {};

        const mailTemplates: MailTemplateInterface<unknown>[] = [];
        for (const discovery of await this.discoveryService.providersWithMetaAtKey<MailTemplateMetadata>(MAIL_TEMPLATE_METADATA_KEY)) {
            const mailTemplate = discovery.discoveredClass.instance;
            if (!isMailTemplate(mailTemplate)) throw new Error(`Class ${discovery.discoveredClass.name} does not implement MailTemplateInterface`);
            if (type && mailTemplate.type !== type) continue;

            mailTemplates.push(mailTemplate);
        }
        return mailTemplates;
    }

    async getMailTemplate<T>(id: string): Promise<MailTemplateInterface<T>> {
        const ret = (await this.getMailTemplates()).find((mailTemplate) => mailTemplate.id === id);
        if (!ret) throw new Error(`MailTemplate not found: ${id}`);
        return ret as MailTemplateInterface<T>; // ATTENTION: this is a cast, we should check if the type is correct
    }

    /**
     * Generates a mail from the template and the params, can for example be used to render the template in admin
     * @param mailTemplate
     * @param params
     */
    async generateMail<T>(mailTemplate: MailTemplateInterface<T>, params: T): Promise<MailOptions> {
        return mailTemplate.generateMail(params);
    }

    async sendMail<T>(mailTemplate: MailTemplateInterface<T>, params: T): Promise<boolean> {
        const mail = await this.generateMail(mailTemplate, params);

        const response = await this.mailerService.sendMail({
            type: mailTemplate.type,
            ...mail,
        });
        return !!response.messageId;
    }
}
