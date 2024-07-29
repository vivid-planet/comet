---
"@comet/cms-admin": major
---

Restructure `MasterMenuData`

Items now need an explicit `type`. There are four types available:

-   `route`

    ```diff
    {
    +   type: "route",
        primary: <FormattedMessage id="menu.dashboard" defaultMessage="Dashboard" />,
        icon: <DashboardIcon />,
        route: {
            path: "/dashboard",
            component: Dashboard,
        },
    },
    ```

-   `externalLink`

    ```diff
    {
    +   type: "externalLink",
        primary: <FormattedMessage id="menu.cometDxp" defaultMessage="COMET DXP" />,
        icon: <Snips />,
        href: "https://comet-dxp.com",
    },
    ```

-   `collapsible`

    ```diff
    {
    +   type: "collapsible",
        primary: <FormattedMessage id="menu.structuredContent" defaultMessage="Structured Content" />,
        icon: <Data />,
    -   submenu: [
    +   items: [
            // ...
        ],
    },
    ```

-   `group` (new)

    ```diff
    {
    +  type: "group",
    +  title: <FormattedMessage id="menu.products" defaultMessage="Products" />,
    +  items: [
    +      // ...
    +  ]
    },
    ```
