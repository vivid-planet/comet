import coreConfig from "./core.js";
import globals from "globals";

/** @type {import('eslint')} */
const config = [
    ...coreConfig,
    {
        languageOptions: {
            globals: {
                ...globals.node,
                ...globals.jest,
            },
        },
        rules: {
            "import/order": "off",
            "no-console": "off",
            "no-duplicate-imports": "error",
            "sort-imports": "off",
            "no-restricted-imports": [
                "error",
                {
                    "paths": [
                        {
                            "name": "class-validator",
                            "importNames": ["IsOptional"],
                            "message": "Please use IsUndefinable or IsNullable from @comet/cms-api instead"
                        },

                        {
                            "name": "@nestjs/common",
                            "importNames": ["ValidationPipe"],
                            "message": "This is just a random import to visualize the concept"
                        }

                    ]
                }
            ]
        },
    },
];

export default config;
