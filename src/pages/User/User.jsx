import React from 'react';
import PropTypes from 'prop-types';
import Helmet from 'react-helmet';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';
import ErrorBoundary from '../../components/ErrorBoundary';
import Loading from '../../components/InnerPageLoader';

export const query = gql`
  query getPost($id: ID!) {
    user(id: $id) {
      name
    }
  }
`;

const User = props => (
  <ErrorBoundary>
    <Query query={query} variables={props.match.params}>
      {({ loading, error, data }) => {
        if (loading) return <Loading />;
        if (error) throw error;
        return (
          <div>
            <Helmet>
              <title>{data.post.title}</title>
            </Helmet>
            <p>{`${data.post.title}: ${data.post.author.name}`}</p>
          </div>
        );
      }}
    </Query>
  </ErrorBoundary>
);

User.propTypes = {
  match: PropTypes.shape({
    params: PropTypes.shape({
      id: PropTypes.string.isRequired
    }).isRequired
  }).isRequired
};

export default User;
