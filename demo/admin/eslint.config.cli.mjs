import eslintConfig from "./eslint.config.mjs";

//TODO: eslint-plugin-graphql is deprecated since 2022 and not capable with eslint 9
/**
 *     plugins: ["graphql"],
 *     rules: {
 *         "graphql/template-strings": [
 *             "error",
 *             {
 *                 env: "apollo",
 *                 schemaJson: require("./schema.json"),
 *             },
 *         ],
 *     },
 */

/** @type {import('eslint')} */
const config = [...eslintConfig];

export default config;
