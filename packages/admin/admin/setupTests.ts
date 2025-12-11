import "@testing-library/jest-dom/jest-globals";
import {jest} from '@jest/globals';

global.ResizeObserver = jest.fn().mockImplementation(() => ({
    observe: jest.fn(),
    unobserve: jest.fn(),
    disconnect: jest.fn(),
}));
 