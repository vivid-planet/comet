/** @type {import('stylelint').Config} */
export default {
    extends: ["stylelint-config-standard"],
    rules: {
        // CSS Module class names are the public part names (`startIcon`), so they are camelCase.
        "selector-class-pattern": "^[a-z][a-zA-Z0-9]*$",
        "selector-pseudo-class-no-unknown": [true, { ignorePseudoClasses: ["global"] }],
        // Private, per-component custom properties are prefixed with `--_`.
        "custom-property-pattern": "^(dextinity-[a-z0-9-]+|_[a-z0-9-]+)$",
        "media-feature-range-notation": "prefix",
    },
};
