export const getFormattedMessageNode = (id: string, defaultMessage = "") => {
    return `<FormattedMessage id="${id}" defaultMessage="${defaultMessage}" />`;
};

export const getFormattedMessageString = (id: string, defaultMessage = "") => {
    return `intl.formatMessage({ id: "${id}", defaultMessage: "${defaultMessage}" })`;
};
