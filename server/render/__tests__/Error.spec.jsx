import React from 'react';
import { shallow } from 'enzyme';
import { Helmet } from 'react-helmet';
import { __DO_NOT_USE_OR_YOU_WILL_BE_HAUNTED_BY_SPOOKY_GHOSTS as styledTools } from 'styled-components';
import fetch from 'isomorphic-unfetch'; // eslint-disable-line no-unused-vars
import ErrorComponent, { errorHandler } from '../Error';

// jest.mock('styled-components');
describe('Error Handler', () => {
  it('should render the page when no internal errors', async () => {
    jest.resetModules();
    Helmet.canUseDOM = false;
    styledTools.StyleSheet.reset(true);
    const err = new Error('THIS IS A TEST ERROR!');
    const req = {
      get(str) {
        return str;
      }
    };
    const res = {
      send() {
        return this;
      },
      status() {
        return this;
      }
    };
    const next = () => {};
    await errorHandler(err, req, res, next);
  });
  it('should render catch internal errors and still render last page', async () => {
    jest.resetModules();
    Helmet.canUseDOM = true;
    styledTools.StyleSheet.reset(false);
    const err = new Error('THIS IS A TEST ERROR!');
    const req = {
      get(str) {
        return str;
      }
    };
    const res = {
      send() {
        return this;
      },
      status() {
        return this;
      }
    };
    const next = () => {};
    await errorHandler(err, req, res, next);
  });
});

describe('Error Component', () => {
  it('should run through with no errors', () => {
    shallow(<ErrorComponent />);
  });
});
