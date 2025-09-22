/** @type {import('stylelint').Config} */
export default {
    extends: ["stylelint-config-standard-scss"],
    rules: {
        "at-rule-empty-line-before": null,
        "selector-class-pattern": null,
        "rule-empty-line-before": null,
        "custom-property-empty-line-before": null,
        "declaration-block-no-redundant-longhand-properties": null,
        "shorthand-property-no-redundant-values": null,
        "selector-pseudo-class-no-unknown": [true, { ignorePseudoClasses: ["global"] }],
        "custom-property-pattern": null,
        "color-hex-length": null,
        "value-keyword-case": null,
    },
};
