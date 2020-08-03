const path = require('path')
const webpack = require('webpack')

module.exports = {
  mode: 'development',
  devtool: 'cheap-module-source-map',
  entry: './src/index.js',
  output: {
    path: __dirname,
    filename: './dist/HXTopology.js',
    libraryTarget: 'umd',
    libraryExport: 'default',
    library: 'HXTopology'
  },
  devServer: {
    compress: false,
    hot: true,
    inline: true,
    watchOptions: {
      ignored: /node_modules/
    }
  },
  module: {
    rules: [
      {
        test: /\.(js)$/,
        exclude: /(node_modules|bower_components)/,
        use: 'babel-loader'
      }
    ]
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin()
  ]
}
