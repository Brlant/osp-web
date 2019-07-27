const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');

function resolve(dir) {
  return path.join(__dirname, '..', dir);
}

module.exports = {
  devServer: {
    open: true,
    port: '8012',
    https: false,
    hotOnly: false, disableHostCheck: true, proxy: {
      '/api': {
        target: 'https://osp.cnvss.net/',
        changOrigin: true
      }
    }
  },
  transpileDependencies: ['@dtop'],
  configureWebpack: {
    plugins: [new CopyWebpackPlugin([
      {
        from: path.resolve(__dirname, 'static'), to: 'static',
        ignore: ['.*']
      }])
    ]
  }
};
