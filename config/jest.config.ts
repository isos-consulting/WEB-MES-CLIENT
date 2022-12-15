import type { Config } from 'jest';

const config: Config = {
  preset: 'ts-jest',
  rootDir: '../',
  roots: ['<rootDir>/src', '<rootDir>/tests'],
  verbose: true,
  testEnvironment: 'node',
  transform: {
    '^.+\\.ts?$': '@swc/jest',
  },
  transformIgnorePatterns: [
    '<rootDir>/node_modules/',
    '<rootDir>/dist/',
    '<rootDir>/build/',
    '<rootDir>/coverage/',
    '<rootDir>/docs/',
  ],
  moduleFileExtensions: ['ts', 'js', 'tsx', 'jsx'],
  moduleNameMapper: {
    '^~/(.*)$': '<rootDir>/src/$1',
  },
};

export default config;
