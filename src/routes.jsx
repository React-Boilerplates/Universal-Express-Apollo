import React from 'react';
import { Route } from 'react-router';
import Home from './pages/Home';
import ErrorPage from './pages/Error';
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
    exact: true,
    path: '/amp/',
    component: Home
  },
  {
    exact: true,
    path: '/amp/posts',
    component: Posts
  },
  {
    exact: true,
    path: '/amp/post/:id',
    component: Post
  }
];

let addedRoutes = [];

if (process.env.NODE_ENV === 'development') {
  addedRoutes = [
    <Route key="error" exact path="/error" component={ErrorPage} />,
    <Route key="none" component={NoMatch} />
  ];
} else {
  addedRoutes = [<Route key="none" component={NoMatch} />];
}

export default Routes.map(props => (
  <Route key={props.path || 'none'} {...props} />
)).concat(addedRoutes);
