import loadable from 'loadable-components';

const PageErrorBoundary = loadable(() =>
  import(/* webpackChunkName: "pageErrorBoundary" */ './PageErrorBoundary')
);

export default PageErrorBoundary;
