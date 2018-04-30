import React from 'react';
import Editor from '../../components/Editor';
import ErrorBoundary from '../../components/ErrorBoundary';

const Home = () => (
  <ErrorBoundary>
    <div>
      <h1>Universal React Starter</h1>
      <div>
        <Editor />
        <h3>Technologies</h3>
        <h4>Production</h4>
        <h5>Express</h5>
        <h5>Styled-Components</h5>
        <h5>Loadable-Components</h5>
        <h5>GraphQL (Apollo-Client AND Apollo-Server)</h5>
        <h5>React Helmet</h5>
        <h4>Testing/Development</h4>
        <h5>Jest</h5>
        <h5>Enzyme</h5>
        <h5>GraphQL Mocks</h5>
        <h5>Eslint</h5>
        <h5>Prettier</h5>
        <h5>Postcss</h5>
        <h5>Webpack 4</h5>
        <h5>Babel 7</h5>
      </div>
    </div>
  </ErrorBoundary>
);

export default Home;
