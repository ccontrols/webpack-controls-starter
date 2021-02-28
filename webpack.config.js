const { resolve } = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const TerserWebpackPlugin = require("terser-webpack-plugin");
const {
  withComponentControls,
} = require("@component-controls/react-router-integration/webpack-build");

const isProd = process.env.NODE_ENV === "production";

const outFolder = process.env.BUILD_PATH || "build";

const distFoloder = resolve(__dirname, outFolder);
const config = {
  mode: isProd ? "production" : "development",
  entry: {
    index: "./src/index.tsx",
  },
  output: {
    path: resolve(__dirname, outFolder),
    publicPath: "/",
    filename: "[name].[hash:8].js",
  },
  resolve: {
    extensions: [".js", ".jsx", ".ts", ".tsx"],
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: "babel-loader",
        exclude: /node_modules/,
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: "Babel + TypeScript + React = ❤️",
      template: "./src/index.html",
    }),
  ],
};

if (isProd) {
  config.optimization = {
    minimizer: [new TerserWebpackPlugin()],
  };
} else {
  // for more information, see https://webpack.js.org/configuration/dev-server
  config.devServer = {
    contentBase: distFoloder,
    port: 8080,
    open: true,
    hot: true,
    compress: true,
    stats: "errors-only",
    overlay: true,
  };
}

module.exports = withComponentControls({
  config,
  development: !isProd,
  options: { distFolder },
});
