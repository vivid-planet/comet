// inspired by: https://advancedweb.hu/how-to-use-async-functions-with-array-filter-in-javascript/
// returns true, when all predicates return true
export const parallelAsyncEvery = <A>(arr: A[], predicate: (item: A) => boolean | Promise<boolean>): Promise<boolean> =>
    Promise.all(arr.map(predicate)).then((results) => results.every((c) => c === true));
