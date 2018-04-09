import loadable from 'loadable-components';

const WayPoint = loadable(() =>
  import(/* webpackChunkName: "onEnter" */ './WayPoint')
);

export default WayPoint;
