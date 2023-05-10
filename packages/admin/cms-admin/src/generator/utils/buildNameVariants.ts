import { plural } from "pluralize";

export function buildNameVariants(entityName: string): {
    classNameSingular: string;
    classNamePlural: string;
    instanceNameSingular: string;
    instanceNamePlural: string;
} {
    const classNameSingular = entityName;
    const classNamePlural = plural(entityName);
    const instanceNameSingular = classNameSingular[0].toLocaleLowerCase() + classNameSingular.slice(1);
    const instanceNamePlural = classNamePlural[0].toLocaleLowerCase() + classNamePlural.slice(1);
    return {
        classNameSingular,
        classNamePlural,
        instanceNameSingular,
        instanceNamePlural,
    };
}
