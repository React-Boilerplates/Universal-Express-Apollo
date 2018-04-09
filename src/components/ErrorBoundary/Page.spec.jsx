/* eslint-env jest */
import React from 'react';
import { shallow, mount } from 'enzyme';
import App from './PageErrorBoundary';

describe('App', () => {
  it('should render', () => {
    const post = shallow(<App />);
    expect(post).toBeDefined();
  });
  it('should catch errors', () => {
    class ErrorThrows extends React.Component {
      componentDidMount() {
        throw new Error('ERROR!!!');
      }
      render() {
        return 'this';
      }
    }
    const post = mount(
      <App>
        <ErrorThrows />
      </App>
    );
    expect(post.state().hasError).toEqual(true);
  });
});
