const path = require("path");
const webpack = require("webpack");
const conf = require("./webpack.config");

delete conf.externals;

conf.entry = "./examples/sandbox/src/index.js";
conf.output = {
  path: path.resolve(__dirname, "examples/sandbox/serve"),
  filename: "example.js"
};

conf.devServer = {
  compress: true,
  hot: true,
  disableHostCheck: true
};

conf.plugins = [...conf.plugins, new webpack.HotModuleReplacementPlugin()];
conf.cache = true;
conf.devtool = "inline-source-map";

module.exports = conf;
