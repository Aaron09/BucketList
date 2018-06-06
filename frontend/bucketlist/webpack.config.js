var webpack = require('webpack');
var path = require('path');

module.exports = {
  entry: { 
    polyfill: "babel-polyfill",
    welcome: path.join(__dirname, 'src', 'welcome-page', 'index.js'), 
    bucket: path.join(__dirname, 'src', 'bucket-page', 'index.js')
  },
  output: {
    path: path.resolve('../../backend', 'assets', 'js'),
    filename: '[name].bundle.js'
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader'
        } 
      },
      { 
        test: /\.css$/, use: ["style-loader", "css-loader"] 
      }
    ]
  },
  resolve: {
    extensions: ['.js', '.jsx', '.css']
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV)
    }),
    new webpack.DefinePlugin({
        "process.env": {
            BROWSER: JSON.stringify(true)
        }
    })
  ]
};
