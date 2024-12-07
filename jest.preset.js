const nxPreset = require('@nx/jest/preset').default;

module.exports = {
    ...nxPreset,
    globals: {
        'ts-jest': {
            isolatedModules: true
        },
    },
};
