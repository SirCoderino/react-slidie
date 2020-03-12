const path = require("path");
const webpack = require("webpack");
const isWsl = require("is-wsl");
const safePostCssParser = require("postcss-safe-parser");
const TerserPlugin = require("terser-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");

const isProduction = process.env.BUILD_MODE == "umd-min";
const mode = isProduction ? "production" : "development";

const filename =
  process.env.BUILD_MODE === "umd"
    ? "sonnat-react-carousel.umd.js"
    : "sonnat-react-carousel.umd.min.js";

const cssRegex = /\.css$/;
const cssModuleRegex = /\.module\.css$/;
const sassRegex = /\.(scss|sass)$/;
const sassModuleRegex = /\.module\.(scss|sass)$/;

const getStyleLoaders = (cssOptions, preProcessor) => {
  const loaders = [
    !isProduction && require.resolve("style-loader"),
    isProduction && { loader: MiniCssExtractPlugin.loader },
    {
      loader: require.resolve("css-loader"),
      options: cssOptions
    },
    {
      loader: require.resolve("postcss-loader"),
      options: { ident: "postcss", sourceMap: isProduction }
    }
  ].filter(Boolean);

  if (preProcessor) {
    loaders.push(
      {
        loader: require.resolve("resolve-url-loader"),
        options: { sourceMap: isProduction }
      },
      {
        loader: require.resolve(preProcessor),
        options: { sourceMap: true }
      }
    );
  }

  return loaders;
};

module.exports = {
  mode,
  entry: "./src/lib/index.js",
  output: {
    path: path.resolve(__dirname, "dist"),
    filename,
    sourceMapFilename: `${filename}.map`,
    libraryTarget: "umd",
    library: "SonnatCarousel"
  },
  optimization: {
    minimize: isProduction,
    minimizer: [
      new TerserPlugin({
        terserOptions: {
          parse: {
            ecma: 8
          },
          compress: {
            ecma: 5,
            warnings: false,
            comparisons: false,
            inline: 2
          },
          mangle: {
            safari10: true
          },
          output: {
            ecma: 5,
            comments: false,
            ascii_only: true
          }
        },
        parallel: !isWsl,
        cache: true,
        sourceMap: true
      }),
      new OptimizeCSSAssetsPlugin({
        cssProcessorOptions: {
          parser: safePostCssParser,
          map: { inline: false, annotation: true }
        }
      })
    ]
  },
  devtool: "source-map",
  externals: {
    react: {
      commonjs: "react",
      commonjs2: "react",
      amd: "react",
      root: "React"
    },
    "react-dom": {
      commonjs: "react-dom",
      commonjs2: "react-dom",
      amd: "react-dom",
      root: "ReactDOM"
    }
  },
  plugins: [
    new webpack.EnvironmentPlugin({ NODE_ENV: mode }),
    isProduction &&
      new MiniCssExtractPlugin({
        filename: "static/css/style.min.css",
        chunkFilename: "static/css/style.chunk.min.css"
      })
  ].filter(Boolean),
  resolve: {
    modules: [path.resolve("src"), "node_modules"]
  },
  module: {
    rules: [
      // Disable require.ensure as it's not a standard language feature.
      { parser: { requireEnsure: false } },

      // First, run the linter.
      // It's important to do this before Babel processes the JS.
      {
        test: /\.(js|mjs|jsx|ts|tsx)$/,
        enforce: "pre",
        use: [
          {
            loader: require.resolve("eslint-loader"),
            options: {
              eslintPath: require.resolve("eslint"),
              resolvePluginsRelativeTo: __dirname
            }
          }
        ],
        include: path.resolve("src")
      },
      {
        oneOf: [
          // Process application JS with Babel.
          {
            test: /\.(js|mjs|jsx|ts|tsx)$/,
            loader: require.resolve("babel-loader"),
            exclude: /node_modules/,
            options: {
              cacheDirectory: true,
              cacheCompression: isProduction,
              compact: isProduction
            }
          },
          {
            test: cssRegex,
            exclude: cssModuleRegex,
            use: getStyleLoaders({
              importLoaders: 1,
              sourceMap: isProduction
            }),
            sideEffects: true
          },
          {
            test: cssModuleRegex,
            use: getStyleLoaders({
              importLoaders: 1,
              sourceMap: isProduction,
              modules: true
            })
          },
          {
            test: sassRegex,
            exclude: sassModuleRegex,
            use: getStyleLoaders(
              {
                importLoaders: 2,
                sourceMap: isProduction
              },
              "sass-loader"
            )
          },
          {
            test: sassModuleRegex,
            use: getStyleLoaders(
              {
                importLoaders: 2,
                sourceMap: isProduction,
                modules: true
              },
              "sass-loader"
            )
          },
          {
            loader: require.resolve("file-loader"),
            exclude: [/\.(js|mjs|jsx|ts|tsx)$/, /\.html$/, /\.json$/],
            options: {
              name: "static/media/[name].[ext]"
            }
          }
        ]
      }
    ]
  },
  node: {
    process: false,
    setImmediate: false
  }
};
