module.exports = {
  stories: ['../stories/**/*.stories.[tj]sx'],
  webpackFinal: async config => {
    config.module.rules.push({
      test: /\.(ts|tsx)$/,
      use: [{loader: require.resolve('ts-loader')},
            {loader: require.resolve('react-docgen-typescript-loader')}]})

    config.resolve.alias = {
      'react-native': 'react-native-web'
    }

    config.resolve.extensions.push('ts.web', '.ts', '.tsx', '.js.web')

    return config
  }}
