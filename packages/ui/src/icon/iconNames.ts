/**
 * The names of the icons in the icon set. Each one is a design token, `--dextinity-icon-<name>`, which a theme can
 * replace.
 *
 * @experimental
 */
export const iconNames = [
    "arrow-left",
    "arrow-right",
    "bell",
    "calendar",
    "check",
    "chevron-down",
    "chevron-left",
    "chevron-right",
    "chevron-up",
    "close",
    "copy",
    "danger",
    "dashboard",
    "delete",
    "download",
    "edit",
    "external-link",
    "eye",
    "eye-off",
    "file",
    "filter",
    "folder",
    "globe",
    "heart",
    "help",
    "home",
    "image",
    "info",
    "link",
    "lock",
    "logout",
    "mail",
    "menu",
    "minus",
    "more",
    "orders",
    "pages",
    "plus",
    "products",
    "refresh",
    "search",
    "settings",
    "star",
    "success",
    "upload",
    "user",
    "users",
    "warning",
] as const;

/** @experimental */
export type IconName = (typeof iconNames)[number];
