// eslint-disable-next-line @typescript-eslint/no-var-requires
const path = require('path');
const fs = require('fs');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const appDirectory = fs.realpathSync(process.cwd());
const resolveAppPath = relativePath => path.resolve(appDirectory, relativePath);
// Host
const host = process.env.HOST || 'localhost';

// Required for babel-preset-react-app
process.env.NODE_ENV = 'development';

module.exports = {
  entry: './src/index.tsx',
  devtool: 'source-map',
  mode: 'development',
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        loader: 'ts-loader',
        exclude: /node_modules/,
        options: {
          configFile: 'tsconfig.build.json',
        },
      },
      {
        test: /\.scss$/,
        use: ['style-loader', 'css-loader', 'sass-loader'],
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
      {
        test: /\.m?js$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env'],
          },
        },
      },
      {
        test: /\.(png|svg|jpg|gif)$/,
        use: [
          'file-loader',
        ],
      },
    ],
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
    fallback: {
      'zlib': require.resolve('browserify-zlib'),
      'util': require.resolve('util/'),
      'url': require.resolve('url/'),
      'tty': require.resolve('tty-browserify'),
      'stream': require.resolve('stream-browserify'),
      'path': require.resolve('path-browserify'),
      'os': require.resolve('os-browserify'),
      'https': require.resolve('https-browserify'),
      'http': require.resolve('stream-http'),
      'assert': require.resolve('assert/'),
      'buffer': require.resolve('buffer/'),
      'fs': false,
    }
  },
  output: {
    publicPath: '/',
    filename: '[name].[fullhash].js',
    path: path.resolve(__dirname, 'build'),
    library: 'CondoWeb',
  },
  plugins: [
    // Re-generate index.html with injected script tag.
    // The injected script tag contains a src value of the
    // filename output defined above.
    new HtmlWebpackPlugin({
      title: 'condo-web',
      inject: 'body',
      template: resolveAppPath('public/index.html'),
    }),
  ],
  devServer: {
    // Serve index.html as the base
    static: resolveAppPath('public'),
    // Enable compression
    compress: true,
    historyApiFallback: true,
    // Enable hot reloading
    hot: true,
    host,
    port: 3001,
    // Public path is root of content base
    proxy: {
      '/api': 'http://localhost:3000'
    },
  },
};
