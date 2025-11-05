module.exports = {
  hooks: {
    readPackage(pkg) {
      if (pkg.name === 'swiper') {
        pkg.peerDependencies = {
          ...pkg.peerDependencies,
          react: '>=16.8.0',
          'react-dom': '>=16.8.0',
        };
        pkg.peerDependenciesMeta = {
          ...pkg.peerDependenciesMeta,
          react: { optional: true },
          'react-dom': { optional: true },
        };
      }
      return pkg;
    },
  },
};