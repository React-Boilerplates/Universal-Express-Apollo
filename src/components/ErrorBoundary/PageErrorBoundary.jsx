import React from 'react';
import ErrorPage from '../../pages/Error';

class PageErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      errorId: null
    };
  }
  componentDidCatch(error, info) {
    import(/* webpackChunkName: "errorReportingService" */ './errorReportingService').then(
      reporter => {
        reporter.default(error, info).then(notice => {
          console.log(notice);
          this.setState({
            errorId: notice?.id,
            hasError: true
          });
        });
      }
    );
  }
  render() {
    if (this.state.hasError) {
      return <ErrorPage {...this.state} />;
    }
    return this.props.children;
  }
}

PageErrorBoundary.propTypes = React.PropTypes;

export default PageErrorBoundary;
