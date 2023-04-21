module.exports = {
  productionSourceMap: false,

  configureWebpack: {
    devtool: 'source-map',
  },

  chainWebpack: (config) => {
    config.plugin('html').tap((args) => {
      // eslint-disable-next-line no-param-reassign
      args[0].title = process.env.VUE_APP_TITLE;
      return args;
    });
  },

  css: {
    loaderOptions: {
      scss: {
        additionalData: '@import "@/assets/scss/_variables.scss";',
      },
    },
  },

  pwa: {
    name: process.env.VUE_APP_TITLE,
    themeColor: '#2E3192',
    msTileColor: '#F84D5B',
    manifestOptions: {
      background_color: '#F84D5B',
    },
  },
};
