const HtmlWebpackPlugin = require("html-webpack-plugin");
const HtmlWebpackInlineSourcePlugin = require("html-webpack-inline-source-plugin");

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
      // All files with a '.ts' or '.tsx' extension will be handled by 'awesome-typescript-loader'.
      { test: /\.tsx?$/, loader: "awesome-typescript-loader" },

      // All output '.js' files will have any sourcemaps re-processed by 'source-map-loader'.
      { enforce: "pre", test: /\.js$/, loader: "source-map-loader" }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: "TRES is Recursive Encrypted Sharing",
      inlineSource: ".(js|css)$",
      template: "src/index.html"
    }),
    new HtmlWebpackInlineSourcePlugin()
  ],
  node: {
    fs: "empty",
    net: "empty",
    tls: "empty"
  }
};
