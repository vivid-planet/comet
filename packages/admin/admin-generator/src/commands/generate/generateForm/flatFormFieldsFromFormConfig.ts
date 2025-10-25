import { type FormConfig, type FormFieldConfig, isFormFieldConfig, isFormLayoutConfig } from "../generate-command";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function flatFormFieldsFromFormConfig(config: FormConfig<any>): FormFieldConfig<any>[] {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return config.fields.reduce<FormFieldConfig<any>[]>((acc, field) => {
        if (isFormLayoutConfig(field)) {
            // using forEach instead of acc.push(...field.fields.filter(isFormFieldConfig)) because typescript can't handle mixed typing
            field.fields.forEach((nestedFieldConfig) => {
                if (isFormFieldConfig(nestedFieldConfig)) {
                    acc.push(nestedFieldConfig);
                }
            });
        } else if (isFormFieldConfig(field)) {
            acc.push(field);
        }
        return acc;
    }, []);
}
