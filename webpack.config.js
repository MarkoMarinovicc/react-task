const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: ['core-js/stable', 'regenerator-runtime/runtime', './src/index.tsx'],
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js',
    clean: true,
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.jsx'],
  },
  module: {
    rules: [
      {
        test: /\.(ts|tsx)$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'babel-loader',
            options: {
              presets: [
                ['@babel/preset-env', {
                  targets: {
                    chrome: '20',
                  },
                  useBuiltIns: 'entry',
                  corejs: 3,
                  modules: false,
                }],
                ['@babel/preset-react', {
                  runtime: 'automatic',
                }],
                '@babel/preset-typescript',
              ],
              plugins: [
                '@babel/plugin-transform-arrow-functions',
                '@babel/plugin-transform-template-literals',
                '@babel/plugin-transform-classes',
                '@babel/plugin-proposal-class-properties',
              ],
            },
          },
        ],
      },
      {
        test: /\.css$/,
        use: [
          'style-loader',
          'css-loader',
          {
            loader: 'postcss-loader',
            options: {
              postcssOptions: {
                plugins: [
                  require('tailwindcss'),
                  require('autoprefixer'),
                ],
              },
            },
          },
        ],
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './public/index.html',
    }),
  ],
  devServer: {
    static: {
      directory: path.join(__dirname, 'dist'),
    },
    compress: true,
    port: 3000,
    hot: true,
    // Proxy
    proxy: {
      '/api/epg': {
        target: 'https://tvprofil.net',
        changeOrigin: true,
        pathRewrite: {
          '^/api/epg': '/xmltv/data/epg_tvprofil.net.xml',
        },
        secure: false,
      },
    },
  },
  mode: 'development',
};

