import React from 'react';
import { Route } from 'react-router';
import Home from './pages/Home';
import Post from './pages/Post';
import Posts from './pages/Posts';
import NoMatch from './pages/NoMatch';

const Routes = [
  {
    exact: true,
    path: '/',
    component: Home
  },
  {
    exact: true,
    path: '/posts',
    component: Posts
  },
  {
    exact: true,
    path: '/post/:id',
    component: Post
  },
  {
    component: NoMatch
  }
];

export default Routes.map(props => (
  <Route key={props.path || 'none'} {...props} />
));
