export const muiGridPagingToGql = (options: { page: number; pageSize: number }) => {
    const { page, pageSize } = options;

    return { offset: page * pageSize, limit: pageSize };
};
