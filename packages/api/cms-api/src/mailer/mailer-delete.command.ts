import { CreateRequestContext, MikroORM } from "@mikro-orm/core";
import { InjectRepository } from "@mikro-orm/nestjs";
import { EntityRepository } from "@mikro-orm/postgresql";
import { Logger } from "@nestjs/common";
import { add, Duration } from "date-fns";
import { Command, CommandRunner } from "nest-commander";

import { MailerLog } from "./entities/mailer-log.entity";

@Command({
    name: "cms.mailer.deleteMailLogOlderThan <count> <duration>",
    arguments: "<count> <duration>",
    description: "Deletes mailer logs created before the given duration (years/months/weeks/days/hours/minutes/seconds)",
})
export class MailerDeleteCommand extends CommandRunner {
    private readonly logger = new Logger(MailerDeleteCommand.name);

    constructor(
        private readonly orm: MikroORM,
        @InjectRepository(MailerLog) private mailerLogRepository: EntityRepository<MailerLog<unknown>>,
    ) {
        super();
    }

    @CreateRequestContext()
    async run([countString, durationString]: string[]): Promise<void> {
        const count = parseInt(countString, 10);
        const duration: Duration = { [durationString]: count * -1 };
        const deleteBefore = add(new Date(), duration);
        await this.mailerLogRepository.nativeDelete({ createdAt: { $lt: deleteBefore } });
    }
}
