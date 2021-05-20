const { merge } = require('webpack-merge');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const common = require('./webpack.common.js');
const TerserPlugin = require('terser-webpack-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');

module.exports = merge(common, {
  mode: 'production',
  optimization: {
    minimize: true,
    minimizer: [new TerserPlugin({ extractComments: false }), new UglifyJsPlugin()],
  },
  plugins: [
    new CopyWebpackPlugin({
      patterns: [{ from: 'src/assets/manifest-prod.json', to: 'manifest.json' }],
    }),
  ],
});
