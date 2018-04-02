import React from 'react';
import PropTypes from 'prop-types';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';
import ErrorBoundary from '../../components/ErrorBoundary';
import Error from '../Error';
import Loading from '../../components/InnerPageLoader';

export const query = gql`
  query getPost($id: ID!) {
    post(id: $id) {
      title
      author {
        name
      }
    }
  }
`;

const Posts = props => (
  <ErrorBoundary>
    <Query query={query} variables={props.match.params}>
      {({ loading, error, data }) => {
        if (loading) return <Loading />;
        if (error) return <Error />;
        return (
          <div>
            <p>{`${data.post.title}: ${data.post.author.name}`}</p>
          </div>
        );
      }}
    </Query>
  </ErrorBoundary>
);

Posts.propTypes = {
  match: PropTypes.shape({
    params: PropTypes.shape({
      id: PropTypes.string.isRequired
    }).isRequired
  }).isRequired
};

export default Posts;
