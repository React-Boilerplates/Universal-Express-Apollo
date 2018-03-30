import React from 'react';
import PropTypes from 'prop-types';
import Header from './Header';
import Content from './Content';
import Footer from './Footer';

const Layout = ({ children }) => (
  <React.Fragment>
    <Header />
    <Content>{children}</Content>
    <Footer />
  </React.Fragment>
);

Layout.propTypes = {
  children: PropTypes.any.isRequired // eslint-disable-line react/forbid-prop-types
};

export default Layout;
