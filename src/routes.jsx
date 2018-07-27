import React from 'react';
import { Route } from 'react-router';
import * as Routes from './pages';

const routes = [
  {
    exact: true,
    path: '/',
    component: Routes.Home
  },
  {
    exact: true,
    path: '/amp/',
    component: Routes.Home
  },
  {
    exact: true,
    path: '/post/:id/:name?',
    component: Routes.Post
  },
  {
    exact: true,
    path: '/amp/post/:id/:name?',
    component: Routes.Post
  },
  {
    exact: true,
    path: '/user/:id/:name?',
    component: Routes.User
  },
  {
    exact: true,
    path: '/amp/user/:id/:name?',
    component: Routes.User
  },
  {
    exact: true,
    path: '/posts/:after?',
    component: Routes.Posts
  },
  {
    exact: true,
    path: '/amp/posts/:after?',
    component: Routes.Posts
  },
  {
    exact: true,
    path: '/users/:after?',
    component: Routes.Users
  },
  {
    exact: true,
    path: '/amp/users/:after?',
    component: Routes.Users
  }
];

let addedRoutes = [];

if (process.env.NODE_ENV === 'development') {
  addedRoutes = [
    <Route key="error" exact path="/error" component={Routes.ErrorPage} />,
    <Route key="none" component={Routes.NoMatch} />
  ];
} else {
  addedRoutes = [<Route key="none" component={Routes.NoMatch} />];
}

export default routes
  .map(props => <Route key={props.path || 'none'} {...props} />)
  .concat(addedRoutes);
