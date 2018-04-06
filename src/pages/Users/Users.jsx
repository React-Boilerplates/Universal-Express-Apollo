import React from 'react';
import gql from 'graphql-tag';
import Page from '../../components/Page';
import Link from '../../components/Style/InlineLink';
import Post from '../Post';

const query = gql`
  query getUsers($after: String) {
    users(after: $after) {
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
          name
        }
      }
    }
  }
`;

const Users = () => (
  <Page title="Users" query={query} paginate root="users">
    {data =>
      data.users.edges.map(({ node }) => node).map(({ id, name }) => (
        <div key={id}>
          <Link to={`/user/${id}`} onMouseOver={Post.load} onFocus={Post.load}>
            <div>{`${name}`}</div>
          </Link>
        </div>
      ))
    }
  </Page>
);

export default Users;
