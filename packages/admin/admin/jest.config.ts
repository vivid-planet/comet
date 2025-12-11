import type {Config} from 'jest';
import { createDefaultEsmPreset } from 'ts-jest'

const defaultPreset = createDefaultEsmPreset({
  tsconfig: 'tsconfig.test.json',
})

const config: Config = {
  ...defaultPreset,
  

  testEnvironment: "jsdom",
      setupFilesAfterEnv: ["<rootDir>/setupTests.ts"],

  moduleNameMapper: {
    '^test-utils$': '<rootDir>/src/utils/test-utils.tsx',
     '^@apollo/client$': '@apollo/client/index.js',
  },
};

export default config;
