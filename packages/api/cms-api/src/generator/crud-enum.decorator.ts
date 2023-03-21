export function CrudFieldEnum(name: string): PropertyDecorator {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return function (target: any, propertyKey: string | symbol) {
        Reflect.defineMetadata(`data:crudFieldEnum`, name, target.constructor, propertyKey);
    };
}
