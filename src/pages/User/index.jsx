import loadable from 'loadable-components';

const UserPage = loadable(() =>
  import(/* webpackChunkName: "user" */ './UserPage')
);

export default UserPage;
