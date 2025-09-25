import { MikroOrmModule } from "@mikro-orm/nestjs";
import { type DynamicModule, Global, Module } from "@nestjs/common";
import { createTransport } from "nodemailer";
import SMTPTransport from "nodemailer/lib/smtp-transport";

import { MailerLog } from "./entities/mailer-log.entity";
import { MAILER_MODULE_TRANSPORT, MAILER_SERVICE_CONFIG } from "./mailer.constants";
import { MailerService } from "./mailer.service";
import { SendTestMailCommand } from "./send-test-mail.command";

export type MailerModuleConfig = {
    defaultFrom: string;
    sendAllMailsTo?: string[];
    sendAllMailsBcc?: string[];
    disableMailLog?: boolean;
    /** @default 90 */
    daysToKeepMailLog?: number;
    transport: SMTPTransport | SMTPTransport.Options;
};

@Global()
@Module({})
export class MailerModule {
    static register({ transport, ...config }: MailerModuleConfig): DynamicModule {
        const mailerTransport = createTransport(transport);
        return {
            module: MailerModule,
            imports: [MikroOrmModule.forFeature([MailerLog])],
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
