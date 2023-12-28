// eslint-disable-next-line @typescript-eslint/no-var-requires
const path = require('path');
//
// Host
// const host = process.env.HOST || 'localhost';

// Required for babel-preset-react-app
// process.env.NODE_ENV = 'development';

module.exports = {
  entry: './server/server.ts',
  devtool: 'source-map',
  mode: 'development',
  target: 'node',
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        loader: 'ts-loader',
        exclude: /node_modules/,
        options: {
          configFile: 'tsconfig.server.json',
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
  },
  output: {
    publicPath: '/',
    filename: 'server.js',
    path: path.resolve(__dirname, 'server-dist'),
    library: 'CondoServer',
  },
};
