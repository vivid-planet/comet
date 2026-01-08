import { type FormattedMessageElement } from "../generate-command.js";
import { isGeneratorConfigFormattedMessage } from "./runtimeTypeGuards.js";

type GenerateFormattedMessageOptions = (
    | { config: string | FormattedMessageElement | undefined; defaultMessage: string }
    | { config: string | FormattedMessageElement }
) & { id: string; type: "jsx" | "intlCall" };

/**
 * Generates a <FormattedMessage> JSX element or an intl.formatMessage call string supporting <FormattedMessage> config objects.
 *
 * either config or defaultMessage is required
 */
export const generateFormattedMessage = (options: GenerateFormattedMessageOptions) => {
    let id = options.id;
    let defaultMessage = "";

    if ("defaultMessage" in options) {
        defaultMessage = options.defaultMessage;
    }
    if (isGeneratorConfigFormattedMessage(options.config)) {
        id = options.config.formattedMessageId;
        defaultMessage = options.config.defaultMessage;
    } else if (typeof options.config === "string") {
        defaultMessage = options.config;
    }
    if (options.type === "jsx") {
        return `<FormattedMessage id=${JSON.stringify(id)} defaultMessage=${JSON.stringify(defaultMessage)} />`;
    } else {
        return `intl.formatMessage({ id: ${JSON.stringify(id)}, defaultMessage: ${JSON.stringify(defaultMessage)} })`;
    }
};
