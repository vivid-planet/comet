import { Inject, Injectable, Logger } from "@nestjs/common";
import { createTransport, Transporter } from "nodemailer";
import { Address, Options as MailOptions } from "nodemailer/lib/mailer";

import { MAILER_MODULE_OPTIONS } from "./mailer.constants";
import { MailerModuleConfig } from "./mailer.module";

@Injectable()
export class MailerService {
    private mailerTransport: Transporter;
    private readonly logger = new Logger(MailerService.name);

    constructor(@Inject(MAILER_MODULE_OPTIONS) private readonly mailerConfig: MailerModuleConfig) {
        this.mailerTransport = createTransport(mailerConfig);
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

    private async _sendMail(originMailOptions: MailOptions) {
        // this is needed because only on production stage we are allowed to send mails to customers
        const mailOptions: MailOptions = this.mailerConfig.sendAllMailsTo
            ? { ...originMailOptions, to: this.mailerConfig.sendAllMailsTo, cc: undefined, bcc: undefined }
            : originMailOptions;

        const result = await this.mailerTransport.sendMail(mailOptions);
        if (!result.messageId) this.logger.error("Mail could not be sent!");
        return result;
    }

    /**
     * Sends a mail without logging it in the database.
     * @param mailOptions `from` defaults to this.config.mailer.defaultFrom, sendAllMailsBcc is always added to `bcc`
     */
    async sendMailWithoutLog(mailOptions: MailOptions) {
        return this._sendMail(this.fillMailOptionsDefaults(mailOptions));
    }

    /**
     * Sends a mail and logs it in the database.
     * @param type Mail type, e.g. order confirmation, order cancellation, etc. to filter in the mailer log
     * @param additionalData Put your additional data here, e.g. orderId, resourcePoolId, etc.
     * @param originMailOptions `from` defaults to this.config.mailer.defaultFrom, sendAllMailsBcc is always added to `bcc`
     */
    async sendMail({ type, additionalData, ...originMailOptions }: MailOptions & { type?: string; additionalData?: unknown }) {
        const mailOptionsWithDefaults = this.fillMailOptionsDefaults(originMailOptions);

        const result = await this._sendMail(mailOptionsWithDefaults);

        return result;
    }

    private normalizeToArray(item: string | Address | Array<string | Address> | undefined): Array<string | Address> {
        return item ? (Array.isArray(item) ? item : [item]) : [];
    }
}
