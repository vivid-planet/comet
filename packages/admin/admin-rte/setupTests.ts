// TODO remove this once `@comet/admin-rte` is ESM
jest.mock("@comet/admin-icons", () => ({
    RteOl: jest.fn(), 
    RteUl: jest.fn(),
}));