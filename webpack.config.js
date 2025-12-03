const path = require('path')
const CopyPlugin = require('copy-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const { EnvironmentPlugin } = require('webpack')

const PDFTRON_LOCAL_PATH = "./node_modules/@pdftron/webviewer"
const PDFTRON_REMOTE_PATH = `/wv-${require(`${PDFTRON_LOCAL_PATH}/package.json`).version}`

module.exports = env => ({
  mode: env.production ? 'production' : 'development',
  entry: {
    app: { import: ['./src/app.js'] },
  },
  output: {
    path: path.resolve(__dirname, './www'),
    filename: env.production ? '[name].[chunkhash].js' : '[name].js',
    clean: true,
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.jsx', '.js'], // Allow import without file extension
    fallback: {
      path: false,
    }
  },
  module: {
    rules: [
      {
        // Compile JavaScript and TypeScript with Babel
        test: /\.(js|jsx|ts|tsx)$/i,
        // Limit to src only for better performance
        include: path.resolve(__dirname, 'src'),
        use: {
          loader: 'babel-loader',
          options: {
            cacheDirectory: true,
          },
        },
      },
      {
        // Compile SCSS with SASS and MiniCssExtractPlugin to generate a CSS file
        test: /\.s[ac]ss$/i,
        use: [MiniCssExtractPlugin.loader, 'css-loader', 'sass-loader'],
      },
      {
        // Use other assets as-is
        test: /\.(gif|png|woff2|svg|pdf)/i,
        type: 'asset/resource',
      },
    ],
  },
  plugins: [
    new CopyPlugin({
      patterns: [
        {
          // Copy PDFTron WebViewer
          context: `${PDFTRON_LOCAL_PATH}/public`,
          from: '**/*',
          to: `.${PDFTRON_REMOTE_PATH}/`,
          globOptions: {
            ignore: [
              '**/core/contentEdit/**',
              '**/core/legacyOffice/**',
              '**/core/pdf/lean/**',
              '**/ui-legacy/**',
              '**/*.map',
            ],
          },
        },
      ],
    }),
    new CopyPlugin({
      patterns: [
        {
          // Copy API docs
          context: `./docs`,
          from: '**/*',
          to: `./api/docs/`,
          noErrorOnMissing: true, // Ignore if docs was not generated
        },
      ],
    }),
    // Add HTML to output. CSS and JS will automatically be injected.
    new HtmlWebpackPlugin({
      template: './src/index.html',
      publicPath: '/', // Ensure CSS and JS are referenced from root path
    }),
    // Define environment variables
    new EnvironmentPlugin({
      PDFTRON_REMOTE_PATH: PDFTRON_REMOTE_PATH,
    }),
  ].filter(Boolean),
  // Source maps : disabled in prod
  devtool: env.production ? false : 'eval',
  devServer: {
    host: '0.0.0.0',
    port: 1234,
    allowedHosts: "all",
    historyApiFallback: true, // Falls back to index.html for all 404 errors
    devMiddleware: {
      writeToDisk: true, // Actually write compiled files in www
    },
  },
})
