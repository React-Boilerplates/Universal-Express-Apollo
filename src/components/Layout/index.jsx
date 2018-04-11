import React from 'react';
import PropTypes from 'prop-types';
import Header from './Header';
import Content from './Content';
import Footer from './Footer';

const Layout = ({ children, plain }) => (
  <React.Fragment>
    <Header plain={plain} />
    <Content>{children}</Content>
    <Footer />
  </React.Fragment>
);

Layout.propTypes = {
  children: PropTypes.any.isRequired, // eslint-disable-line react/forbid-prop-types,
  plain: PropTypes.bool // eslint-disable-line react/forbid-prop-types
};

Layout.defaultProps = {
  plain: false
};

export default Layout;
