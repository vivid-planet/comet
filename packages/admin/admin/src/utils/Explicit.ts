/**
 * Explicit<T> is a utility type that recursively makes all properties of T explicit.
 *
 * if a property is marked as optional (e.g., `property?: Type`), it will be transformed to
 * `property: Type | undefined`, which forces the property to be explicitly defined at least as `undefined`.
 */
export type Explicit<T> = {
    [K in keyof T]-?: T[K] extends object
        ? // eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
          T[K] extends Function
            ? T[K]
            : undefined extends T[K]
              ? Explicit<Exclude<T[K], undefined>> | undefined
              : Explicit<T[K]>
        : T[K];
};
