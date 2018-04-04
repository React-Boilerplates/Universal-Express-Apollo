import React from 'react';
import { Helmet } from 'react-helmet';

const NoMatch = () => (
  <div>
    <Helmet>
      <title>No Match</title>
    </Helmet>
    <h1>Nothing Matches</h1>
    <div>You may have been directed here in error</div>
  </div>
);

export default NoMatch;
