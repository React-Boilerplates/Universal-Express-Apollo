import React from 'react';
import PropTypes from 'prop-types';
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
          slug
          title
          author {
            name
          }
        }
      }
    }
  }
`;

export const Posts = data => (
  <React.Fragment>
    {data.posts.edges
      .map(({ node }) => node)
      .map(({ id, title, slug, author: { name } }) => (
        <div key={id}>
          <Link
            to={`/post/${id}/${slug}`}
            onMouseOver={Post.load}
            onFocus={Post.load}
          >
            <div>{`${title}: ${name}`}</div>
          </Link>
        </div>
      ))}
  </React.Fragment>
);

const PostsPage = ({ match }) => (
  <Page title="Posts" query={query} match={match} paginate root="posts">
    {data => <Posts {...data} />}
  </Page>
);

PostsPage.propTypes = {
  match: PropTypes.shape({
    params: {
      next: PropTypes.string
    }
  }).isRequired
};

export default PostsPage;
