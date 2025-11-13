import { Module } from "@nestjs/common";

import { MailerModule } from "../mailer/mailer.module";
import { MailTemplateCommand } from "./mail-template.command";
import { MailTemplateService } from "./mail-template.service";

@Module({
    imports: [MailerModule],
    providers: [MailTemplateService, MailTemplateCommand],
    exports: [MailTemplateService],
})
export class MailTemplatesModule {}
