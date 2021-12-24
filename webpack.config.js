const path = require('path');

module.exports = {
  mode: 'development',
  entry: {
    "ex-ball": './src/ex-ball.ts'
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        include: [path.resolve(__dirname, 'src')],
        use: 'ts-loader',
      }
    ]
  },
  resolve: {
    extensions: ['.ts', '.js'],
  },
  devtool: 'eval-source-map',
  output: {
    publicPath: 'public',
    filename: '[name].js',
    path: path.resolve(__dirname),
  },
};