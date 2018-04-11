import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import Link, { A } from '../../Style/HeaderLink';

const StyledHeader = styled.header`
  font-size: 1.5em;
  flex: none;
  text-align: center;
  color: palevioletred;
  background-color: papayawhip;
  padding: 1rem;
`;

const Header = ({ plain }) => (
  <StyledHeader>
    {plain ? (
      <React.Fragment>
        <A href="/">Home</A>
        <A href="/posts">Posts</A>
        <A href="/users">Users</A>
      </React.Fragment>
    ) : (
      <React.Fragment>
        <Link activeClassName="active" exact to="/">
          Home
        </Link>
        <Link activeClassName="active" to="/posts">
          Posts
        </Link>
        <Link activeClassName="active" to="/users">
          Users
        </Link>
      </React.Fragment>
    )}
  </StyledHeader>
);

Header.propTypes = {
  plain: PropTypes.bool.isRequired
};

export default Header;
