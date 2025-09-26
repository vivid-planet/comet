import { CreateRequestContext, MikroORM } from "@mikro-orm/core";
import { Logger } from "@nestjs/common";
import { Command, CommandRunner } from "nest-commander";

import { MailTemplateInterface } from "./mail-template.decorator";
import { MailTemplateService } from "./mail-template.service";

@Command({
    name: "mail-template:test",
    description: "test mail template, e.g. ",
    arguments: "[mailTemplateId] [preparedTestParamsIndex]",
})
export class MailTemplateCommand extends CommandRunner {
    private readonly logger = new Logger(MailTemplateCommand.name);

    constructor(
        private readonly orm: MikroORM,
        private readonly mailTemplateService: MailTemplateService,
    ) {
        super();
    }

    @CreateRequestContext()
    async run([mailTemplateId, preparedTestParamsIndex]: Array<string>): Promise<void> {
        const mailTemplate: MailTemplateInterface<object> = await this.mailTemplateService.getMailTemplate(mailTemplateId);
        const preparedTestParams = (await mailTemplate.getPreparedTestParams())[parseInt(preparedTestParamsIndex)];
        this.logger.log(`Sending test mail for ${mailTemplate.id}`);
        await this.mailTemplateService.sendMail<object>(mailTemplate, preparedTestParams.params);
    }
}
