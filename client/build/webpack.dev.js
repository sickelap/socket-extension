const path = require('path');
const { merge } = require('webpack-merge');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const common = require('./webpack.common.js');

module.exports = merge(common, {
  mode: 'development',
  entry: {
    'hot-reload': path.resolve(__dirname, '../src/chrome-hot-reload.ts'),
  },
  plugins: [
    new CopyWebpackPlugin({
      patterns: [{ from: 'src/assets/manifest-dev.json', to: 'manifest.json' }],
    }),
  ],
});
