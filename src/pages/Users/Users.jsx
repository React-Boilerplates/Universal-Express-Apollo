import React from 'react';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';
import Helmet from 'react-helmet';
import ErrorBoundary from '../../components/ErrorBoundary';
import Link from '../../components/Style/InlineLink';
import Post from '../Post';
import Loading from '../../components/InnerPageLoader';

const query = gql`
  query getUsers {
    users {
      pageInfo {
        startCursor
        endCursor
        hasPreviousPage
        hasNextPage
      }
      edges {
        cursor
        node {
          id
          title
          author {
            name
          }
        }
      }
    }
  }
`;

const Users = () => (
  <ErrorBoundary>
    <Helmet>
      <title>Users</title>
    </Helmet>
    <Query query={query}>
      {({ loading, error, data }) => {
        if (loading) return <Loading />;
        if (error) throw error;
        return data.users.edges
          .map(({ node }) => node)
          .map(({ id, title, author: { name } }) => (
            <div key={title}>
              <Link
                to={`/user/${id}`}
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

export default Users;
