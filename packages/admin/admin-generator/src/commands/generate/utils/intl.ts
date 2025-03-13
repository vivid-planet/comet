export const getFormattedMessageNode = (id: string, defaultMessage = "", values?: string) => {
    return `<FormattedMessage id="${id}" defaultMessage={\`${defaultMessage}\`} ${values ? `values={${values}}` : ""} />`;
};
