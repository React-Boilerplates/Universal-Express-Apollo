import React from 'react';
import PropTypes from 'prop-types';
import Helmet from 'react-helmet';
import gql from 'graphql-tag';
import Page from '../../components/Page';

export const query = gql`
  query getUser($id: ID!) {
    user(id: $id) {
      name
    }
  }
`;

const UserPage = props => (
  <Page query={query} match={props.match}>
    {data => (
      <div>
        <Helmet>
          <title>{data.user.name}</title>
        </Helmet>
        <p>{`${data.user.name}`}</p>
      </div>
    )}
  </Page>
);

UserPage.propTypes = {
  match: PropTypes.shape({
    params: PropTypes.shape({
      id: PropTypes.string.isRequired
    }).isRequired
  }).isRequired
};

export default UserPage;
