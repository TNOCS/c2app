const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const Dotenv = require('dotenv-webpack');
const HtmlWebpackTagsPlugin = require('html-webpack-tags-plugin');
// const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const webpack = require('webpack');
const { GenerateSW } = require('workbox-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');

module.exports = (env) => {
  const isProduction = env.production;
  const outputPath = path.resolve(__dirname, isProduction ? '../../docs' : './dist');
  const publicPath = isProduction ? 'https://erikvullings.github.io/c2app/' : process.env.SERVER_URL + '/' ;

  console.log(`Running in ${isProduction ? 'production' : 'development'} mode, output directed to ${outputPath}.`);

  return {
    mode: isProduction ? 'production' : 'development',
    entry: './src/app.ts',
    devtool: isProduction ? 'source-map' : 'inline-source-map',
    devServer: {
      liveReload: true,
      port: 1234,
      compress: true,
    },
    plugins: [
      new webpack.WatchIgnorePlugin({
        paths: [/\.js$/, /\.d\.ts$/],
      }),
      new Dotenv(),
      new HtmlWebpackPlugin({
        title: 'SAFR',
        favicon: './src/favicon.ico',
        meta: { viewport: 'width=device-width, initial-scale=1' },
      }),
      new HtmlWebpackTagsPlugin({
        links: [
          {
            path: './app.webmanifest',
            publicPath: false,
            attributes: {
              rel: 'manifest',
            },
          },
        ],
        metas: [
          {
            attributes: { property: 'og:title', content: 'SAFR' },
          },
          {
            attributes: {
              property: 'og:description',
              content: 'SA and C2 tools for FRs',
            },
          },
          {
            attributes: {
              property: 'og:url',
              content: 'https://timovdk.github.io/c2app/',
            },
          },
          {
            path: './src/assets/safr.svg',
            attributes: {
              property: 'og:image',
            },
          },
          {
            attributes: { property: 'og:locale', content: 'en_UK' },
          },
          {
            attributes: { property: 'og:site_name', content: 'SAFR' },
          },
          {
            attributes: { property: 'og:image:alt', content: 'SAFR' },
          },
          {
            attributes: {
              property: 'og:image:type',
              content: 'image/svg',
            },
          },
          {
            attributes: {
              property: 'og:image:width',
              content: '200',
            },
          },
          {
            attributes: {
              property: 'og:image:height',
              content: '200',
            },
          },
        ],
      }),
      // new MiniCssExtractPlugin({
      //   filename: isProduction ? '[name].[contenthash].css' : '[name].css',
      //   chunkFilename: isProduction ? '[id].[contenthash].css' : '[id].css',
      // }),
      isProduction &&
        new GenerateSW({
          swDest: 'sw.js',
          maximumFileSizeToCacheInBytes: 10000000,
          clientsClaim: true,
          skipWaiting: true,
        }),
      new CopyPlugin({
        patterns: [
          { from: 'src/app.webmanifest' },
          { from: 'src/assets/pwa-192x192.png', to: 'assets/pwa-192x192.png' },
          { from: 'src/assets/pwa-512x512.png', to: 'assets/pwa-512x512.png' },
        ],
      }),
    ].filter(Boolean),
    module: {
      rules: [
        {
          test: /\.ts$/,
          use: [
            {
              loader: 'ts-loader',
              options: {
                configFile: path.resolve(__dirname, 'tsconfig.json'),
                projectReferences: true,
              },
            },
          ],
          exclude: /node_modules/,
        },
        {
          test: /\.css$/i,
          use: ['style-loader', 'css-loader'],
        },
        {
          test: /\.(png|svg|jpg|jpeg|gif)$/i,
          type: 'asset/resource',
        },
        {
          test: /\.(woff|woff2|eot|ttf|otf)$/i,
          type: 'asset/resource',
        },
        // {
        //   test: /\.css$/,
        //   use: [MiniCssExtractPlugin.loader, 'css-loader'],
        // },
        // {
        //   test: /\.(csv|tsv)$/i,
        //   use: ['csv-loader'],
        // },
        // {
        //   test: /\.xml$/i,
        //   use: ['xml-loader'],
        // },
      ],
    },
    resolve: {
      extensions: ['.ts', '.js', '.json'],
    },
    optimization: {
      minimizer: [
        // For webpack@5 you can use the `...` syntax to extend existing minimizers (i.e. `terser-webpack-plugin`), uncomment the next line
        // `...`,
        new CssMinimizerPlugin(),
      ],
    },
    output: {
      filename: 'bundle.js',
      path: outputPath,
      publicPath,
    },
  };
};
