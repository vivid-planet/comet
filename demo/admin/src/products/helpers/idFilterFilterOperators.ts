import { getGridStringOperators } from "@mui/x-data-grid";

/**
 * MUI Data Grid filter operators to match the IdFilter GraphQL input type.
 */
export const idFilterFilterOperators = getGridStringOperators().filter((operator) => ["isAnyOf", "equals", "doesNotEqual"].includes(operator.value));
