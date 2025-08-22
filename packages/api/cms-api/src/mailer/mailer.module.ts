import { type DynamicModule, Global, Module } from "@nestjs/common";
import { createTransport } from "nodemailer";
import SMTPTransport from "nodemailer/lib/smtp-transport";

import { MAILER_MODULE_TRANSPORT, MAILER_SERVICE_CONFIG } from "./mailer.constants";
import { MailerService } from "./mailer.service";
import { SendTestMailCommand } from "./send-test-mail.command";

export type MailerModuleConfig = {
    defaultFrom: string;
    sendAllMailsTo?: string[];
    sendAllMailsBcc?: string[];
    transport: SMTPTransport | SMTPTransport.Options;
};

@Global()
@Module({})
export class MailerModule {
    static register({ transport, ...config }: MailerModuleConfig): DynamicModule {
        const mailerTransport = createTransport(transport);
        return {
            module: MailerModule,
            providers: [
                { provide: MAILER_SERVICE_CONFIG, useValue: config },
                { provide: MAILER_MODULE_TRANSPORT, useValue: mailerTransport },
                MailerService,
                SendTestMailCommand,
            ],
            exports: [MailerService],
        };
    }
}
