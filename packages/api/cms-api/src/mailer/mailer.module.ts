import { type DynamicModule, Module } from "@nestjs/common";
import SMTPTransport from "nodemailer/lib/smtp-transport";

import { MAILER_MODULE_OPTIONS } from "./mailer.constants";
import { MailerService } from "./mailer.service";

export type MailerModuleConfig = (SMTPTransport | SMTPTransport.Options) & {
    defaultSender: string;
    sendAllMailsTo?: string[];
    sendAllMailsBcc?: string[];
};

@Module({})
export class MailerModule {
    static forRoot(config: MailerModuleConfig): DynamicModule {
        return {
            module: MailerModule,
            providers: [{ provide: MAILER_MODULE_OPTIONS, useValue: config }, MailerService],
            exports: [MailerService],
        };
    }
}
