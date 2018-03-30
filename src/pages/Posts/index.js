import loadable from 'loadable-components';

const Posts = loadable(() => import(/* webpackChunkName: "posts" */ './Posts'));

export default Posts;
