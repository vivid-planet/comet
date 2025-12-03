module.exports = function () {
    return {
        plugins: [
            [
                "@emotion",
                {
                    importMap: {
                        "@mui/system": {
                            styled: {
                                canonicalImport: ["@emotion/styled", "default"],
                                styledBaseImport: ["@mui/system", "styled"],
                            },
                        },
                        "@mui/material/styles": {
                            styled: {
                                canonicalImport: ["@emotion/styled", "default"],
                                styledBaseImport: ["@mui/material/styles", "styled"],
                            },
                        },
                    },
                },
            ],
        ],
    };
};
