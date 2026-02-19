/* eslint-disable @typescript-eslint/no-explicit-any */

type Prev = [never, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9];

type GqlLeaves<T, FollowArrays extends boolean = false, Depth extends number = 5> = [Depth] extends [never]
    ? never
    : T extends any
      ? T extends Array<infer ArrayType>
          ? FollowArrays extends true
              ? GqlLeaves<ArrayType, FollowArrays, Prev[Depth]>
              : never
          : "__typename" extends keyof T
            ? {
                  [K in keyof T as K extends "__typename" ? never : K]-?: GqlLeaves<T[K], FollowArrays, Prev[Depth]>;
              }
            : never
      : never;
type IfExplicitAny<T, Y, N> = T extends never ? Y : N;

// UsableFields steps into objects containing __typename but does not include those objects themselves
type FieldNames<T> = {
    [K in keyof T]: `${Exclude<K, symbol>}${FieldNames<T[K]> extends never ? "" : `.${FieldNames<T[K]>}`}`;
}[keyof T];
export type UsableFields<T, FollowArrays extends boolean = false> = IfExplicitAny<T, any, FieldNames<GqlLeaves<T, FollowArrays>>>;

// UsableFormFields steps into objects containing __typename and does include those objects themselves
type FormFieldNames<T> = {
    [K in keyof T]: `${Exclude<K, symbol>}` | (FormFieldNames<T[K]> extends never ? never : `${Exclude<K, symbol>}.${FormFieldNames<T[K]>}`);
}[keyof T];
export type UsableFormFields<T> = IfExplicitAny<T, any, FormFieldNames<GqlLeaves<T, false>>>;
