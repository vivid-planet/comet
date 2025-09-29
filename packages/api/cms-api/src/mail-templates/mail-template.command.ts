import { CreateRequestContext, MikroORM } from "@mikro-orm/core";
import { Logger } from "@nestjs/common";
import { Command, CommandRunner } from "nest-commander";

import { MailTemplateInterface } from "./mail-template.decorator";
import { MailTemplateService } from "./mail-template.service";

@Command({
    name: "mail-template:test",
    description: "test mail template, e.g. ",
    arguments: "[mailTemplateId] [preparedTestPropsIndex]",
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
    async run([mailTemplateId, preparedTestPropsIndex]: Array<string>): Promise<void> {
        const mailTemplate: MailTemplateInterface<object> = await this.mailTemplateService.getMailTemplate(mailTemplateId);
        const preparedTestProps = (await mailTemplate.getPreparedTestProps())[parseInt(preparedTestPropsIndex)];
        this.logger.log(`Sending test mail for ${mailTemplate.id}`);
        await this.mailTemplateService.sendMail<object>(mailTemplate, preparedTestProps.props);
    }
}
