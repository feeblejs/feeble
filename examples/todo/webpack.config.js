var path = require('path')
var webpack = require('webpack')

module.exports = {
  devtool: 'source-map',
  entry: './src/index.js',
  output: {
    path: path.join(__dirname, 'dist'),
    filename: 'bundle.js'
  },
  module: {
    loaders: [
      {
        test: /\.js$/,
        loader: 'babel',
        exclude: /node_modules/,
        include: [
          path.resolve(__dirname, './src')
        ]
      },
    ]
  },
  progress: true,
  resolve: {
    extensions: ['', '.json', '.js'],
  },
};
