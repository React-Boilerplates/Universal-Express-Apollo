/* globals IntersectionObserver */
import React from 'react';
import PropTypes from 'prop-types';

class OnEnter extends React.Component {
  componentDidMount() {
    this.observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) this.props.onEnter();
          else this.props.onExit();
        });
      },
      {
        root: null,
        threshold: 0.5
      }
    );
    this.observer.observe(this.div);
  }

  render() {
    const { onEnter, onExit, ...props } = this.props;
    return (
      <div
        ref={div => {
          this.div = div;
        }}
        {...props}
        style={{ visibility: 'hidden' }}
      />
    );
  }
}

OnEnter.propTypes = {
  onEnter: PropTypes.func,
  onExit: PropTypes.func
};

OnEnter.defaultProps = {
  onEnter: () => console.log('onEnter'),
  onExit: () => console.log('onExit')
};

export default OnEnter;
