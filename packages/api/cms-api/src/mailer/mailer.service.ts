import { EntityManager } from "@mikro-orm/core";
import { InjectRepository } from "@mikro-orm/nestjs";
import { EntityRepository } from "@mikro-orm/postgresql";
import { Inject, Injectable, Logger } from "@nestjs/common";
import { createTransport, Transporter } from "nodemailer";
import Mail, { Address, Options as MailOptions } from "nodemailer/lib/mailer";

import { MailerLog } from "./entities/mailer-log.entity";
import { MAILER_MODULE_OPTIONS } from "./mailer.constants";
import { MailerModuleConfig } from "./mailer.module";

@Injectable()
export class MailerService {
    private mailerTransport: Transporter;
    private readonly logger = new Logger(MailerService.name);

    constructor(
        @Inject(MAILER_MODULE_OPTIONS) private readonly mailerConfig: MailerModuleConfig,
        private readonly entityManager: EntityManager,
        @InjectRepository(MailerLog) private readonly mailerLogRepository: EntityRepository<MailerLog<unknown>>,
    ) {
        this.mailerTransport = createTransport(mailerConfig.transport);
    }

    private fillMailOptionsDefaults(originMailOptions: MailOptions): MailOptions {
        return {
            ...originMailOptions,
            from: originMailOptions.from || this.mailerConfig.defaultFrom,
            bcc: this.mailerConfig.sendAllMailsBcc
                ? [...this.normalizeToArray(originMailOptions.bcc), ...this.mailerConfig.sendAllMailsBcc]
                : originMailOptions.bcc,
        };
    }

    /**
     * Sends a mail and logs it in the database.
     * @param type Mail type, e.g. order confirmation, order cancellation, etc. to filter in the mailer log
     * @param additionalData Put your additional data here, e.g. orderId, resourcePoolId, etc.
     * @param originMailOptions `from` defaults to this.config.mailer.defaultFrom, sendAllMailsBcc is always added to `bcc`
     */
    async sendMail({
        mailTypeForLogging,
        additionalData,
        ...originMailOptions
    }: MailOptions & { mailTypeForLogging?: string; additionalData?: unknown }) {
        const mailOptionsWithDefaults = this.fillMailOptionsDefaults(originMailOptions);

        let logEntry: MailerLog<unknown> | undefined;
        if (!this.mailerConfig.disableMailLog) {
            logEntry = this.mailerLogRepository.create({
                to: this.normalizeToArray(originMailOptions.to).map<string>(this.convertAddressToString),
                subject: originMailOptions.subject,
                mailOptions: mailOptionsWithDefaults,
                additionalData,
                type: mailTypeForLogging, // for statistic and filter purposes
            });
            await this.entityManager.flush();
        }

        // this is needed because only on production stage we are allowed to send mails to customers
        const mailOptions: MailOptions = this.mailerConfig.sendAllMailsTo
            ? { ...mailOptionsWithDefaults, to: this.mailerConfig.sendAllMailsTo, cc: undefined, bcc: undefined }
            : mailOptionsWithDefaults;

        const result = await this.mailerTransport.sendMail(mailOptions);
        if (!result.messageId) throw new Error(`Sending mail failed, no messageId returned. MailOptions: ${JSON.stringify(mailOptions)}`);

        if (!this.mailerConfig.disableMailLog && logEntry) {
            logEntry.assign({ result });
            await this.entityManager.flush();
        }

        return result;
    }

    private convertAddressToString(item: string | Mail.Address) {
        return typeof item === "string" ? item : `${item.name} <${item.address}>`;
    }

    private normalizeToArray(item: string | Address | Array<string | Address> | undefined): Array<string | Address> {
        return item ? (Array.isArray(item) ? item : [item]) : [];
    }
}
