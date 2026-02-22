const { getDefaultConfig } = require('@expo/metro-config');

const config = getDefaultConfig(__dirname);

// Firebase JS SDK v12+ uses the "exports" field with a "react-native" condition.
// Metro needs this flag to resolve those entries correctly.
config.resolver.unstable_enablePackageExports = true;

// Tell Metro which export conditions to check (and in what order).
// "react-native" must come before "browser" so Metro picks the RN build of Firebase.
config.resolver.unstable_conditionNames = [
  'react-native',
  'browser',
  'require',
  'import',
];

module.exports = config;
