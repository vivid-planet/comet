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

type FieldNames<T> = {
    [K in keyof T]: `${Exclude<K, symbol>}${FieldNames<T[K]> extends never ? "" : `.${FieldNames<T[K]>}`}`;
}[keyof T];
export type UsableFields<T, FollowArrays extends boolean = false> = FieldNames<GqlLeaves<T, FollowArrays>>;
