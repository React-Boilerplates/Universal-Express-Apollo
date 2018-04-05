import loadable from 'loadable-components';

const User = loadable(() => import(/* webpackChunkName: "user" */ './User'));

export default User;
