const dotEnv = require('dotenv');
const path = require('path');

const envPath = path.join(process.cwd(), '.env');

dotEnv.config({
  path: envPath
});

const variables = Object.assign({}, process.env);

const hardScripts = `
<script src="https://cdnjs.cloudflare.com/ajax/libs/babel-polyfill/6.26.0/polyfill.min.js" integrity="sha256-WRc/eG3R84AverJv0zmqxAmdwQxstUpqkiE+avJ3WSo=" crossorigin="anonymous"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/lodash.js/4.17.5/lodash.min.js" integrity="sha256-YFhaeQSVBgAFNN5z4I9YRB2jCuqc2nvypz0Q2eQzcx8=" crossorigin="anonymous"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/react/16.3.0/umd/react.production.min.js" integrity="sha256-QUU/D1wsdE4qpKqEF6BDxI7SNr+QCRDpupwVXYMcFC4=" crossorigin="anonymous"></script>
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
      HARD_CODED_SCRIPTS:
        process.env.NODE_ENV === 'production' ? hardScripts : '',
      COOKIE_SECRET: ''
    },
    variables
  )
);
module.exports = {
  envVariables,
  hardScripts
};
