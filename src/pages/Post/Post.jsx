import React from 'react';
import PropTypes from 'prop-types';
import Helmet from 'react-helmet';
import gql from 'graphql-tag';
import Page from '../../components/Page';
import Link from '../../components/Style/InlineLink';

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

export const Post = data => (
  <div>
    <Helmet>
      <title>{data.post.title}</title>
    </Helmet>
    <h2>{data.post.title}</h2>
    <Link to={`/user/${data.post.author.id}`}>
      <div>{`${data.post.author.name}`}</div>
    </Link>
  </div>
);

const PostPage = props => (
  <Page query={query} match={props.match}>
    {data => <Post {...data} />}
  </Page>
);

PostPage.propTypes = {
  match: PropTypes.shape({
    params: PropTypes.shape({
      id: PropTypes.string.isRequired
    }).isRequired
  }).isRequired
};

export default PostPage;
