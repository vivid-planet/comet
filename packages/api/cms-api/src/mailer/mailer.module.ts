import { MikroOrmModule } from "@mikro-orm/nestjs";
import { type DynamicModule, Global, Module } from "@nestjs/common";
import SMTPTransport from "nodemailer/lib/smtp-transport";

import { DeleteMailLogsCommand } from "./delete-mail-logs.command";
import { MailerLog } from "./entities/mailer-log.entity";
import { MAILER_MODULE_OPTIONS } from "./mailer.constants";
import { MailerService } from "./mailer.service";
import { SendTestMailCommand } from "./send-test-mail.command";

export type MailerModuleConfig = {
    defaultFrom: string;
    sendAllMailsTo?: string[];
    sendAllMailsBcc?: string[];
    disableMailLog?: boolean;
    transport: SMTPTransport | SMTPTransport.Options;
};

@Global()
@Module({})
export class MailerModule {
    static register(config: MailerModuleConfig): DynamicModule {
        return {
            module: MailerModule,
            imports: [MikroOrmModule.forFeature([MailerLog])],
            providers: [{ provide: MAILER_MODULE_OPTIONS, useValue: config }, MailerService, SendTestMailCommand, DeleteMailLogsCommand],
            exports: [MailerService],
        };
    }
}
