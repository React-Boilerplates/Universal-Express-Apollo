/* eslint-env jest */
/* eslint-disable react/prop-types, react/no-multi-comp */
import React from 'react';
import { setMockGraphQLProps } from 'react-apollo';
import { shallow, mount } from 'enzyme';

describe('Page', () => {
  it('should render', () => {
    const Page = require('./Page').default;
    const page = shallow(<Page />);
    expect(page).toBeDefined();
  });
  it('should handle loading in Query', () => {
    setMockGraphQLProps({ data: {}, loading: true });
    const Page = require('./Page').default;
    const page = mount(<Page root="root" />);
    expect(page).toBeDefined();
  });
  it('should handle error in Query', () => {
    setMockGraphQLProps({ error: new Error('Error'), loading: false });
    const Page = require('./Page').default;
    const page = mount(<Page root="root" />);
    expect(page).toBeDefined();
  });
  it('should handle proper render', () => {
    setMockGraphQLProps({ error: false, loading: false });
    const Page = require('./Page').default;
    const page = mount(<Page root="root">{() => {}}</Page>);
    expect(page).toBeDefined();
  });
});
