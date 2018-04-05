import React from 'react';
import PropTypes from 'prop-types';
import Helmet from 'react-helmet';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';
import Link from '../../components/Style/InlineLink';
import ErrorBoundary from '../../components/ErrorBoundary';
import Loading from '../../components/InnerPageLoader';

export const query = gql`
  query getPost($id: ID!) {
    post(id: $id) {
      title
      author {
        name
        id
      }
    }
  }
`;

const Post = props => (
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
            <h1>{data.post.title}</h1>
            <Link to={`/user/${data.post.author.name}`}>
              <div>{`${data.post.author.name}`}</div>
            </Link>
          </div>
        );
      }}
    </Query>
  </ErrorBoundary>
);

Post.propTypes = {
  match: PropTypes.shape({
    params: PropTypes.shape({
      id: PropTypes.string.isRequired
    }).isRequired
  }).isRequired
};

export default Post;
