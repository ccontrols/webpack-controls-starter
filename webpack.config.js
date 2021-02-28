const path = require("path");
const { defaultCompileProps } = require("@component-controls/core");
const { getBundleName } = require("@component-controls/core/node-utils");

const { compile, watch } = require("@component-controls/webpack-compile");

const { resolve } = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const TerserWebpackPlugin = require("terser-webpack-plugin");
const {
  postBuild,
} = require("@component-controls/react-router-integration/post-build");

const isProd = process.env.NODE_ENV === "production";

const outFolder = process.env.BUILD_PATH || "build";

const buildOptions = {
  ...defaultCompileProps,
  configPath: ".config",
  ...{
    distFolder: process.env.DIST_PATH || path.join(process.cwd(), outFolder),
    staticFolder:
      process.env.STATIC_PATH || path.join(process.cwd(), outFolder, "static"),
  },
};
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
      {
        test: require.resolve("@component-controls/store/controls-store"),
        use: {
          loader: require.resolve("@component-controls/store/loader.js"),
          options: {
            bundleFileName: getBundleName(buildOptions),
          },
        },
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
    contentBase: __dirname + "/build/",
    port: 8080,
    open: true,
    hot: true,
    compress: true,
    stats: "errors-only",
    overlay: true,
  };
}

module.exports = async function() {
  const onBundle = async ({ store }) => {
    await postBuild(buildOptions.staticFolder, store);
  };
  const run = process.env.NODE_ENV === "development" ? watch : compile;
  await run(buildOptions, onBundle);
  return config;
};
