import React from 'react';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';
import Helmet from 'react-helmet';
import Error from '../Error';
import ErrorBoundary from '../../components/ErrorBoundary';
import Link from '../../components/Style/InlineLink';
import Post from '../Post';
import Loading from '../../components/InnerPageLoader';

const query = gql`
  {
    posts {
      id
      title
      author {
        name
      }
    }
  }
`;

const Posts = () => (
  <ErrorBoundary>
    <Helmet>
      <title>Posts</title>
    </Helmet>
    <Query query={query}>
      {({ loading, error, data }) => {
        if (loading) return <Loading />;
        if (error) return <Error />;
        return data.posts.map(({ id, title, author: { name } }) => (
          <div key={title}>
            <Link
              to={`/post/${id}`}
              onMouseOver={Post.load}
              onFocus={Post.load}
            >
              <div>{`${title}: ${name}`}</div>
            </Link>
          </div>
        ));
      }}
    </Query>
  </ErrorBoundary>
);

export default Posts;
