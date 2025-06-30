import { Inject, Injectable, Logger } from "@nestjs/common";
import { Transporter } from "nodemailer";
import { Address, Options as MailOptions } from "nodemailer/lib/mailer";

import { MAILER_MODULE_OPTIONS, MAILER_MODULE_TRANSPORT } from "./mailer.constants";

export type MailerServiceConfig = {
    defaultFrom: string;
    sendAllMailsTo?: string[];
    sendAllMailsBcc?: string[];
};

@Injectable()
export class MailerService {
    private readonly logger = new Logger(MailerService.name);

    constructor(
        @Inject(MAILER_MODULE_OPTIONS) private readonly mailerConfig: MailerServiceConfig,
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
     * @param type Mail type, e.g. order confirmation, order cancellation, etc. to filter in the mailer log
     * @param additionalData Put your additional data here, e.g. orderId, resourcePoolId, etc.
     * @param originMailOptions `from` defaults to this.config.mailer.defaultFrom, sendAllMailsBcc is always added to `bcc`
     */
    async sendMail({ type, additionalData, ...originMailOptions }: MailOptions & { type?: string; additionalData?: unknown }) {
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
