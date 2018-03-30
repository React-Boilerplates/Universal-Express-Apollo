import React from 'react';
// import { Link } from 'react-router-dom';
import styled from 'styled-components';

// export const height = '100px';

// const StyledLink = styled(Link)`
//   color: palevioletred;
//   font-weight: bold;
//   text-decoration: none;
//   padding: 1rem;
// `;

const StyledFooter = styled.footer`
  font-size: 1.1em;
  flex: none;
  z-index: 2;
  text-align: center;
  color: palevioletred;
  background-color: papayawhip;
  padding: 1rem;
`;

const Footer = () => <StyledFooter>Created By Craig Couture</StyledFooter>;

export default Footer;
