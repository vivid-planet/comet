export const getFormattedMessageNode = (id: string, defaultMessage = "", values?: string) => {
    return `<FormattedMessage id="${id}" defaultMessage={\`${defaultMessage}\`} ${values ? `values={${values}}` : ""} />`;
};

export const getFormattedMessageString = (id: string, defaultMessage = "") => {
    return `intl.formatMessage({ id: "${id}", defaultMessage: "${defaultMessage}" })`;
};
