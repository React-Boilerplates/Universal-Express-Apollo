import React from 'react';
import gql from 'graphql-tag';
import Page from '../../components/Page';
import Link from '../../components/Style/InlineLink';
import Post from '../Post';

const query = gql`
  query getPosts($after: String) {
    posts(after: $after) {
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

const Posts = () => (
  <Page title="Posts" query={query} paginate root="posts">
    {data =>
      data.posts.edges
        .map(({ node }) => node)
        .map(({ id, title, author: { name } }) => (
          <div key={id}>
            <Link
              to={`/post/${id}`}
              onMouseOver={Post.load}
              onFocus={Post.load}
            >
              <div>{`${title}: ${name}`}</div>
            </Link>
          </div>
        ))
    }
  </Page>
);

export default Posts;
