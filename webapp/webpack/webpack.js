const webpack = require("webpack");
const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const argv = require("minimist")(process.argv.slice(2));
const package = require("../package.json");

const config = {
  context: __dirname,
  mode: argv.mode === "production" ? "production" : "development",
  bail: true,
  devtool: false,
  entry: {
    arart: ['./src/index.js']
  },

  output: {
    path: path.resolve(__dirname, "dist"),
    publicPath: "/",
    filename: "js/[name].js",
    sourceMapFilename: "js/[name].js.map[query]",
    chunkFilename: "js/bundle.[name].js",
    assetModuleFilename: "assets/[name]-[contenthash][ext]",
    hashFunction: "xxhash64",
  },

  plugins: [
    new HtmlWebpackPlugin({
      title:
        argv.mode === "production"
          ? "AR Art Gallery"
          : process.env.npm_package_version,
      filename: "index.html",
      scriptLoading: "defer",
      favicon: "./src/favicon.ico",
      meta: {
        "application-name": "AR Art Gallery",
        "theme-color": "#000000",
        description: "A place to hang your augmented art annotations",
        robots: "index,follow",
        "og:title":
          argv.mode === "production"
            ? "AR Art Gallery"
            : process.env.npm_package_version,
        "og:site_name": "AR Art Gallery",
        "og:type": "website",
        "og:description": "Hang your Augmented Art annotations here!",
        "og:image": "some image...",
        "twitter:card": "summary_large_image",
        "twitter:image:alt": "AR Art Gallery",
        viewport: "width=device-width,initial-scale=1.0",
      },
    }),
    new MiniCssExtractPlugin({ filename: "[name]-[contenthash].css" })
  ],
  module: {
    rules: [
      {
        test: /\.js$/,
        use: ["babel-loader"],
      },
      {
        test: /\.css$/,
        use: [MiniCssExtractPlugin.loader, "css-loader"],
      },
      {
        test: /\.png$|\.jpg$|\.svg$/,
        type: "asset",
      }
    ],
  },

  resolve: {
    extensions: [".js", ".json"],
    fallback: {
      https: false,
      stream: false,
      zlib: false,
      crypto: false,
      http: false,
      buffer: false,
      assert: false,
      fs: false,
      net: false,
      tls: false,
      inherits: false,
      path: false,
      console: false,
      process: false,
      util: false,
      url: false,
    },
  },
};

  if (!argv.watch) {
    console.log("Compiling webpack");
    webpack(config, (err, stats) => {
      if (err) {
        console.error("Webpack Error:");
        console.log(err);
        throw new Error("Webpack build failed");
      }
      if (stats.hasErrors() || stats.hasWarnings()) {
        console.log(stats.toString({ colors: true }));
        return;
      }
      console.log(
        stats.toString({
          colors: true,
          warnings: true,
          assets: true,
          moduleAssets: true,
          groupAssetsByChunk: false,
          groupAssetsByEmitStatus: false,
          groupAssetsByInfo: false,
          orphanModules: true,
          modules: true,
          groupModulesByAttributes: false,
          dependentModules: true,
          entrypoints: true,
          chunks: false,
          chunkGroups: false,
          chunkModules: false,
          chunkOrigins: false,
          chunkRelations: false,
          env: true,
          performance: true,
        })
      );
    });
  } else {
    console.log("Watching build folder");
    webpack(config).watch(
      {
        aggregateTimeout: 500,
        poll: 2000,
        ignored: /node_modules/,
      },
      (err, stats) => {
        if (err) {
          console.error(err);
          return;
        }
        if (stats && stats.hasErrors()) {
          console.error(stats.toString({ colors: true }));
          return;
        }
        console.log(stats.toString({ colors: true }));
      }
    );
  }
