import React from 'react';
import PropTypes from 'prop-types';

class JsonLd extends React.Component {
  constructor(props) {
    super(props);
    const string = JSON.stringify(props.json);
    this.state = {
      string,
      Component: (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: string }}
        />
      )
    };
  }

  componentDidMount() {
    this.handleMounted();
  }
  shouldComponentUpdate(nextProps, nextState) {
    if (nextState.json === this.state.json) {
      return false;
    }
    return true;
  }
  handleMounted = () => {
    this.setState({
      Component: <script type="application/ld+json">{this.state.string}</script>
    });
  };
  render() {
    return this.state.Component;
  }
}

JsonLd.propTypes = {
  // eslint-disable-next-line react/forbid-prop-types
  json: PropTypes.object.isRequired
};

export default JsonLd;
