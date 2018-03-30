import loadable from 'loadable-components';

const Post = loadable(() => import(/* webpackChunkName: "post" */ './Post'));

export default Post;
