const dotEnv = require('dotenv');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

const path = require('path');

const envPath = path.join(process.cwd(), '.env');

dotEnv.config({
  path: envPath
});

const variables = Object.assign({}, process.env);

const hardScripts = `
<script src="https://cdnjs.cloudflare.com/ajax/libs/airbrake-js/1.0.7/client.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/babel-polyfill/6.26.0/polyfill.min.js" integrity="sha256-WRc/eG3R84AverJv0zmqxAmdwQxstUpqkiE+avJ3WSo=" crossorigin="anonymous"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/immutable/3.8.2/immutable.min.js" integrity="sha256-+0IwgnFxUKpHZPXBhTQkuv+Dqy0eDno7myZB6OOjORA=" crossorigin="anonymous"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/lodash.js/4.17.5/lodash.min.js" integrity="sha256-YFhaeQSVBgAFNN5z4I9YRB2jCuqc2nvypz0Q2eQzcx8=" crossorigin="anonymous"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/react/16.3.0/umd/react.production.min.js" integrity="sha256-QUU/D1wsdE4qpKqEF6BDxI7SNr+QCRDpupwVXYMcFC4=" crossorigin="anonymous"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/redux/3.7.2/redux.min.js" integrity="sha256-Y8AuGIYFWCOBO5/w1oXzcEErW4JALGUWiG5VWleVWyw=" crossorigin="anonymous"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/react-redux/5.0.7/react-redux.min.js" integrity="sha256-um7DcEns3J42qU41brDoZeZ1fAn2eHRtLOKLgMZ3UVE=" crossorigin="anonymous"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/redux-form/7.3.0/redux-form.min.js" integrity="sha256-XoTI2YCuIhRZUopK4HSlgpqELEWZ4AoSYQ8K20LUQt8=" crossorigin="anonymous"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/react-dom/16.3.0/umd/react-dom.production.min.js" integrity="sha256-oV3TYJ5p2p0qXA2uT3Mepu7FKa0ZH0pLW2hA5dm+7V4=" crossorigin="anonymous"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/styled-components/3.2.3/styled-components.min.js" integrity="sha256-7p2Aa6qcrahVPo0sZCeYevLDCuextd4z9OmmKhl9fLM=" crossorigin="anonymous"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/react-router-dom/4.2.2/react-router-dom.min.js" integrity="sha256-jLCuf08f087TmqfJOoAIRiS+J81kiDT4hdxuxdmPyUQ=" crossorigin="anonymous"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/react-router/4.2.0/react-router.min.js" integrity="sha256-F3sOKqCYiUp2COVFG79Q39WedOcRSDaNZUYh9U3sIyU=" crossorigin="anonymous"></script>
`
  .replace(/\n/, '')
  .replace(/\s+/, ' ');

const envVariables = JSON.stringify(
  Object.assign(
    {
      NAME: 'BoilerPlate',
      PWA: true,
      PWA_THEME_COLOR: '#fff',
      PWA_DESCRIPTION: 'BoilerPlate App',
      PWA_SHORTNAME: 'BoilerPlate',
      PWA_NAME: 'BoilerPlate',
      PWA_BACKGROUND_COLOR: '#fff',
      GOOGLE_SITE_VERIFICATION: '',
      YANDEX_SITE_VERIFICATION: '',
      BING_SITE_VERIFICATION: '',
      HARD_CODED_SCRIPTS:
        process.env.NODE_ENV === 'production' ? hardScripts : '',
      AIRBRAKE_ID: 179755,
      AIRBRAKE_KEY: 'cae7f5949eaf243d0cccfa1329f092d8',
      COOKIE_SECRET: ''
    },
    variables
  )
);

const extractCss = new ExtractTextPlugin({
  filename: '[name].css'
});

const extractSss = new ExtractTextPlugin({
  filename: '[name].css'
});

const sssLoader =
  process.env.NODE_ENV === 'production'
    ? extractSss.extract({
        fallback: 'style-loader',
        use: [{ loader: 'css-loader' }]
      })
    : [
        'style-loader',
        { loader: 'css-loader', options: { importLoaders: 1 } },
        'postcss-loader'
      ];
const cssLoader =
  process.env.NODE_ENV === 'production'
    ? extractCss.extract({
        fallback: 'style-loader',
        use: [{ loader: 'css-loader' }]
      })
    : ['style-loader', { loader: 'css-loader' }];
const extractTextPlugin =
  process.env.NODE_ENV === 'production' ? [extractCss, extractSss] : [];
module.exports = {
  envVariables,
  hardScripts,
  sssLoader,
  extractTextPlugin,
  cssLoader
};
