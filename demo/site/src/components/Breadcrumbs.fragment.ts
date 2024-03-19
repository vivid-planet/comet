export const breadcrumbsFragment = `
    fragment Breadcrumbs on PageTreeNode {
        name
        path
        parentNodes {
            name
            path
        }
    }
`;
