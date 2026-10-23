/** @type {import('stylelint').Config} */
export default {
    extends: ["stylelint-config-standard"],
    rules: {
        // CSS Module class names are the public part names (`startIcon`), so they are camelCase.
        "selector-class-pattern": "^[a-z][a-zA-Z0-9]*$",
        "selector-pseudo-class-no-unknown": [true, { ignorePseudoClasses: ["global"] }],
        // Private, per-component custom properties are prefixed with `--_`. Base UI sets the others on its parts,
        // for example the size of a popup's anchor.
        "custom-property-pattern":
            "^(dextinity-[a-z0-9-]+|_[a-z0-9-]+|anchor-(width|height)|available-(width|height)|transform-origin|collapsible-panel-(width|height)|active-tab-[a-z]+)$",
        "media-feature-range-notation": "prefix",
    },
};
