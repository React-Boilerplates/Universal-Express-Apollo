/* globals IntersectionObserver */
import React from 'react';
import PropTypes from 'prop-types';
import logger from '../../logger';

class WayPoint extends React.Component {
  constructor(props) {
    super(props);
    this.style = {};
  }
  componentDidMount() {
    this.style = { visibility: 'hidden' };
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
      <button
        ref={div => {
          this.div = div;
        }}
        {...props}
        style={this.style}
        onClick={onEnter}
      >
        Load More
      </button>
    );
  }
}

WayPoint.propTypes = {
  onEnter: PropTypes.func,
  onExit: PropTypes.func
};

WayPoint.defaultProps = {
  onEnter: () => logger.log('onEnter'),
  onExit: () => logger.log('onExit')
};

export default WayPoint;
