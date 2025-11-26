// TODO remove this once `@comet/cms-admin` is ESM
jest.mock("@comet/admin-icons", () => ({
    Add: jest.fn(),
    ArrowLeft: jest.fn(),
    ChevronDown: jest.fn(),
    ChevronLeft: jest.fn(),
    ChevronRight: jest.fn(),
    ChevronUp: jest.fn(),
    Clear: jest.fn(),
    Close: jest.fn(),
    Delete: jest.fn(),
    Edit: jest.fn(),
    Error: jest.fn(),
    Info: jest.fn(),
    LevelUp: jest.fn(),
    Save: jest.fn(),
    ThreeDotSaving: jest.fn(),
    Warning: jest.fn(),
}));