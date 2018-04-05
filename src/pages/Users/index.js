import loadable from 'loadable-components';

const Users = loadable(() => import(/* webpackChunkName: "users" */ './Users'));

export default Users;
