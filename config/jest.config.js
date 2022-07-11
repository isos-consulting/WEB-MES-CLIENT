module.exports = {
    preset: 'ts-jest',
    rootDir: '../',
    roots: ['<rootDir>/src', '<rootDir>/tests'],
    verbose: true,
    testEnvironment: 'node',
    transform: {
        '^.+\\.ts?$': 'ts-jest',
    },
    transformIgnorePatterns: ['<rootDir>/node_modules/', '<rootDir>/dist/'],
    moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
};