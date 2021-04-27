// inspired by: https://gist.github.com/Yimiprod/7ee176597fef230d1451#gistcomment-2565071

import { isEqual, isObject, transform } from "lodash";

/**
 * Deep diff between two object, using lodash
 * @param  {Object} object Object compared
 * @param  {Object} base   Object to compare with
 * @return {Object}        Return a new object who represent the diff
 */
function difference<T extends object, TResult>(object: T, base: T): TResult {
    return transform(object, (result, value, key) => {
        if (!isEqual(value, base[key])) {
            // @ts-ignore
            result[key] = isObject(value) && isObject(base[key]) ? difference(value, base[key]) : value;
        }
    });
}

export { difference };
