import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

const Main = styled.main`
  background-color: palevioletred;
  color: papayawhip;
  min-height: 100%;
  z-index: 0;
  height: auto !important; /*Cause footer to stick to bottom in IE 6*/
  height: 100%;
  overflow-y: scroll;
  flex: 1;
  padding: 1rem;
  width: 100%;
  vertical-align: bottom;
`;

const Header = ({ children }) => <Main>{children}</Main>;

Header.propTypes = {
  children: PropTypes.any.isRequired // eslint-disable-line react/forbid-prop-types
};

export default Header;
