/* eslint-disable @typescript-eslint/no-explicit-any */
const isRangeValue = (value: Record<string, any>): boolean => {
    return Object.keys(value).length === 2 && "min" in value && "max" in value;
};

export const dirtyFieldsCount = (values: Record<string, any>, registeredFields: string[]): number => {
    let count = 0;
    Object.entries(values).forEach(([fieldName, fieldValue]) => {
        if (!fieldValue) {
            return;
        }

        const isRegisteredField = registeredFields.includes(fieldName);

        if (Array.isArray(fieldValue) && isRegisteredField) {
            count += fieldValue.length;
        } else if (typeof fieldValue === "object") {
            if (isRangeValue(fieldValue) && isRegisteredField) {
                count++;
            } else {
                const registeredSubFields = registeredFields.reduce((res, field) => {
                    if (field.startsWith(`${fieldName}.`)) {
                        //remove field prefix for recursive call
                        res.push(field.substr(fieldName.length + 1));
                    }
                    return res;
                }, [] as string[]);
                count += dirtyFieldsCount(fieldValue, registeredSubFields);
            }
        } else if (isRegisteredField) {
            count++;
        }
    });

    return count;
};
