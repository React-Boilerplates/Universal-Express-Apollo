import loadable from 'loadable-components';

export default loadable(() =>
  import(/* webpackChunkName: "midPageLoader" */
  './InnerPageLoader')
);
