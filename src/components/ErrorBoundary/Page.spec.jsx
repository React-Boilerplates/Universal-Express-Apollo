/* eslint-env jest */
import React from 'react';
import { shallow, mount } from 'enzyme';
import sinon from 'sinon';
import App from './PageErrorBoundary';

describe('App', () => {
  it('should render', () => {
    const post = shallow(<App />);
    expect(post).toBeDefined();
  });
  it('should catch errors', async () => {
    class ErrorThrows extends React.Component {
      componentDidMount() {
        throw new Error('ERROR!!!');
      }
      render() {
        return 'this';
      }
    }
    sinon.spy(App.prototype, 'componentDidCatch');
    await mount(
      <App>
        <ErrorThrows />
      </App>
    );
    expect(App.prototype.componentDidCatch.called).toBe(true);
  });
});
