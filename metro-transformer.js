const upstreamTransformer = require('metro-react-native-babel-transformer');
const fs = require('fs');

module.exports.transform = function ({ src, filename, options }) {
  if (filename.endsWith('.sql')) {
    const sqlContent = fs.readFileSync(filename, 'utf8');
    return upstreamTransformer.transform({
      src: `module.exports = ${JSON.stringify(sqlContent)};`,
      filename,
      options,
    });
  }
  return upstreamTransformer.transform({ src, filename, options });
};
