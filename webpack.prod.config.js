const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const CopyPlugin = require("copy-webpack-plugin");
const CreateFilePlugin = require("create-file-webpack");

const {
  withComponentControls,
} = require("@component-controls/react-router-integration/webpack-build");

const publicFolder = process.env.PUBLIC_PATH || "public";
const distFolder = process.env.BUILD_PATH || "build";
const distPath = path.join(__dirname, distFolder);

const config = {
  mode: "production",
  entry: "./src/index.tsx",
  output: {
    path: distPath,
    filename: "[name].[contenthash].js",
    publicPath: "",
  },
  module: {
    rules: [
      {
        test: /\.(ts|js)x?$/i,
        include: /src/,
        use: {
          loader: "babel-loader",
          options: {
            presets: [
              "@babel/preset-env",
              "@babel/preset-react",
              "@babel/preset-typescript",
            ],
          },
        },
      },
    ],
  },
  resolve: {
    extensions: [".tsx", ".ts", ".js"],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: "src/index.html",
    }),
    new CopyPlugin({
      patterns: [{ from: publicFolder }],
    }),
    new CleanWebpackPlugin(),
    new CreateFilePlugin({
      path: distFolder,
      fileName: "_redirects",
      content: `
      /*  /index.html  200
`,
    }),
  ],
  performance: {
    maxEntrypointSize: 2000000,
    maxAssetSize: 2000000,
  },
};

module.exports = withComponentControls({
  config,
  options: { configPath: ".config", distFolder: publicFolder },
});
