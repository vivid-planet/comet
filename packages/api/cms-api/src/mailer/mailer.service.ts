import { Inject, Injectable, Logger } from "@nestjs/common";
import { Transporter } from "nodemailer";
import { Address, Options as MailOptions } from "nodemailer/lib/mailer";

import { MAILER_MODULE_TRANSPORT, MAILER_SERVICE_CONFIG } from "./mailer.constants";
import { MailerModuleConfig } from "./mailer.module";

type MailerServiceConfig = Omit<MailerModuleConfig, "transport">;

@Injectable()
export class MailerService {
    private readonly logger = new Logger(MailerService.name);

    constructor(
        @Inject(MAILER_SERVICE_CONFIG) private readonly mailerConfig: MailerServiceConfig,
        @Inject(MAILER_MODULE_TRANSPORT) private readonly mailerTransport: Transporter,
    ) {}

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
     * If mailerConfig.sendAllMailsTo is set, the mail will be sent to this address instead of the `to` address and `bcc` will be omitted. This can
     * be used to prevent non-prod environments from sending mails to real customers.
     * @param mailTypeForLogging Mail type, e.g. order confirmation, order cancellation, etc. to filter in the mailer log
     * @param additionalData Put your additional data here, e.g. orderId, resourcePoolId, etc.
     * @param originMailOptions `from` defaults to this.config.mailer.defaultFrom, sendAllMailsBcc is always added to `bcc`
     */
    async sendMail({
        mailTypeForLogging,
        additionalData,
        ...originMailOptions
    }: MailOptions & { mailTypeForLogging?: string; additionalData?: unknown }): Promise<Mail> {
        const mailOptionsWithDefaults = this.fillMailOptionsDefaults(originMailOptions);

        // this is needed because only on production stage we are allowed to send mails to customers
        const mailOptions: MailOptions = this.mailerConfig.sendAllMailsTo
            ? { ...mailOptionsWithDefaults, to: this.mailerConfig.sendAllMailsTo, cc: undefined, bcc: undefined }
            : mailOptionsWithDefaults;

        const result = await this.mailerTransport.sendMail(mailOptions);
        if (!result.messageId) throw new Error(`Sending mail failed, no messageId returned. MailOptions: ${JSON.stringify(mailOptions)}`);

        return result;
    }

    private normalizeToArray(item: string | Address | Array<string | Address> | undefined): Array<string | Address> {
        return item ? (Array.isArray(item) ? item : [item]) : [];
    }
}
