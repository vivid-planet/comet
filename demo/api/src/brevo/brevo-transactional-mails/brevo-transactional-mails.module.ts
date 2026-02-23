import { Module } from "@nestjs/common";

import { BrevoTransactionalMailsController } from "./brevo-transactional-mails.controller";

@Module({
    controllers: [BrevoTransactionalMailsController],
})
export class BrevoTransactionalMailsModule {}
