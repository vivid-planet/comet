import { MikroOrmModule } from "@mikro-orm/nestjs";
import { type DynamicModule, Global, Module } from "@nestjs/common";
import SMTPTransport from "nodemailer/lib/smtp-transport";

import { MailerLog } from "./entities/mailer-log.entity";
import { MAILER_MODULE_OPTIONS } from "./mailer.constants";
import { MailerService } from "./mailer.service";
import { MailerDeleteCommand } from "./mailer-delete.command";

export type MailerModuleConfig = (SMTPTransport | SMTPTransport.Options) & {
    defaultSender: string;
    sendAllMailsTo?: string[];
    sendAllMailsBcc?: string[];
    disableMailLog?: boolean;
};

@Global()
@Module({})
export class MailerModule {
    static register(config: MailerModuleConfig): DynamicModule {
        return {
            module: MailerModule,
            imports: [MikroOrmModule.forFeature([MailerLog])],
            providers: [{ provide: MAILER_MODULE_OPTIONS, useValue: config }, MailerService, MailerDeleteCommand],
            exports: [MailerService],
        };
    }
}
