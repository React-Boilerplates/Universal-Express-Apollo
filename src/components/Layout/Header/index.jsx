import React from 'react';
import styled from 'styled-components';
import Link from '../../Style/HeaderLink';

const StyledHeader = styled.header`
  font-size: 1.5em;
  flex: none;
  text-align: center;
  color: palevioletred;
  background-color: papayawhip;
  padding: 1rem;
`;

const Header = () => (
  <StyledHeader>
    <Link activeClassName="active" exact to="/">
      Home
    </Link>
    <Link activeClassName="active" to="/posts">
      Posts
    </Link>
    <Link activeClassName="active" to="/users">
      Users
    </Link>
  </StyledHeader>
);

export default Header;
