import React from 'react';
import ErrorPage from '../../pages/Error';

class PageErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false
    };
  }
  componentDidCatch(error, info) {
    this.setState(() => ({ hasError: true }));
    import(/* webpackChunkName: "errorReportingService" */ './errorReportingService').then(
      reporter => {
        reporter.default(error, info);
      }
    );
  }
  render() {
    if (this.state.hasError) {
      return <ErrorPage />;
    }
    return this.props.children;
  }
}

PageErrorBoundary.propTypes = React.PropTypes;

export default PageErrorBoundary;
