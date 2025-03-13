// eslint-disable-next-line @typescript-eslint/no-explicit-any
type GqlLeaves<T> = T extends any
    ? "__typename" extends keyof T
        ? {
              [K in keyof T as K extends "__typename" ? never : K]-?: GqlLeaves<T[K]>;
          }
        : never
    : never;

type FieldNames<T> = {
    [K in keyof T]: `${Exclude<K, symbol>}${FieldNames<T[K]> extends never ? "" : `.${FieldNames<T[K]>}`}`;
}[keyof T];
export type UsableFields<T> = FieldNames<GqlLeaves<T>>;
