import React from 'react';
import { shallow } from 'enzyme';
// import { Helmet } from 'react-helmet';
// import { __DO_NOT_USE_OR_YOU_WILL_BE_HAUNTED_BY_SPOOKY_GHOSTS as styledTools } from 'styled-components';
import fetch from 'isomorphic-unfetch'; // eslint-disable-line no-unused-vars
import AppComponent from '../App';

describe('App Component', () => {
  it('should run through with no errors', () => {
    const req = {
      url: new URL('http://crazt.com/test'),
      path: '/test'
    };
    shallow(<AppComponent req={req} />);
  });
});
