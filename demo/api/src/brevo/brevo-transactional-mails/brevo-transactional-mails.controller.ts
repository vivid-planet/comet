import { BrevoTransactionalMailsService } from "@comet/brevo-api";
import { DisableCometGuards } from "@comet/cms-api";
import { Body, Controller, Post } from "@nestjs/common";

import { BrevoTransactionalMailsBody } from "./dto/transactional-mails.body";

@Controller("transactional-mails")
export class BrevoTransactionalMailsController {
    constructor(private readonly brevoTransactionalMailsService: BrevoTransactionalMailsService) {}

    @DisableCometGuards()
    @Post(`/send`)
    async send(@Body() { text, subject, to, scope }: BrevoTransactionalMailsBody): Promise<void> {
        await this.brevoTransactionalMailsService.send({ to: [{ email: to }], textContent: text, subject }, scope);
    }
}
