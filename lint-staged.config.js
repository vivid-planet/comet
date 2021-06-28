module.exports = {
    "packages/**/*.{ts,tsx,js,jsx}": () => "yarn lint",
    "*": () => "yarn prettier -c .",
};
