import { type DynamicModule, Global, Module } from "@nestjs/common";
import type SMTPTransport from "nodemailer/lib/smtp-transport";

import { MAILER_MODULE_OPTIONS, MAILER_MODULE_TRANSPORT } from "./mailer.constants";
import { MailerService } from "./mailer.service";

export type MailerModuleConfig = (SMTPTransport | SMTPTransport.Options) & {
    defaultSender: string;
    sendAllMailsTo?: string[];
    sendAllMailsBcc?: string[];
};

@Global()
@Module({})
export class MailerModule {
    static async register(config: MailerModuleConfig): Promise<DynamicModule> {
        const nodemailer = await import("nodemailer");
        const mailerTransport = nodemailer.createTransport(config);

        return {
            module: MailerModule,
            providers: [
                { provide: MAILER_MODULE_OPTIONS, useValue: config },
                { provide: MAILER_MODULE_TRANSPORT, useValue: mailerTransport },
                MailerService,
            ],
            exports: [MailerService],
        };
    }
}
