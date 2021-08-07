const HtmlWebpackPlugin = require("html-webpack-plugin");
const HtmlInlineScriptPlugin = require('html-inline-script-webpack-plugin');

module.exports = {
  entry: "./src/index.tsx",
  output: {
    filename: "bundle.js",
    path: __dirname + "/dist"
  },
  mode: "production",
  devtool: "source-map",
  resolve: {
    extensions: [".ts", ".tsx", ".js", ".json", ".css"]
  },

  module: {
    rules: [
      { test: /\.tsx?$/, loader: "ts-loader", options: { allowTsInNodeModules: true } },
      { enforce: "pre", test: /\.js$/, loader: "source-map-loader" }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: "TRES is Recursive Encrypted Sharing",
      inlineSource: ".(js|css)$",
      inject: 'body',
      template: "src/index.html"
    }),
    new HtmlInlineScriptPlugin(),
  ]
};
