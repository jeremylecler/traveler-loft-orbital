const path = require('path')
var nib = require('nib')

var ImageminPlugin = require('imagemin-webpack-plugin').default
var imageminMozjpeg = require('imagemin-mozjpeg')

const productionPlugins = [
  // Optim images
  new ImageminPlugin({
    optipng: {
      optimizationLevel: 3, 
      paletteReduction: true,
      colorTypeReduction: true,
      bitDepthReduction: true
    },
    pngquant: {
      quality: '70-80',
      strip: true
    },
    gifsicle: {
      optimizationLevel: 3
    },
    svgo: {},
    plugins: [
      imageminMozjpeg({
        quality: 75,
        progressive: true
      })
    ]
  })
]

module.exports = {
  lintOnSave: false,
  productionSourceMap: process.env.NODE_ENV != 'production' ? true : false,
  publicPath: '/',
  css: {
    loaderOptions: {
      stylus: {
        use: [nib()],
        import: [
          path.resolve(__dirname, 'src/styles/variables.styl')
        ]
      }
    }
  },
  chainWebpack: config => {
    config.module
      .rule('images')
        .use('url-loader')
          .loader('url-loader')
          .tap(options => Object.assign(options, { limit: 10240 }))
  },
  configureWebpack: config => {
    config.module.rules.push({
      test: /\.yml$/,
      use: [{
        loader: 'json-loader'
      }, {
        loader: 'yaml-loader'
      }]
    });

    if (process.env.NODE_ENV === 'production') {
      config.plugins.push(...productionPlugins)
    };
  }
}

