import loadable from 'loadable-components';

const OnEnter = loadable(() =>
  import(/* webpackChunkName: "onEnter" */ './OnEnter')
);

export default OnEnter;
