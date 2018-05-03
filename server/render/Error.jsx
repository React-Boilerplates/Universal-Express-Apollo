import React from 'react';
import Layout from '../../src/components/Layout';
import ErrorPage from '../../src/pages/Error/Error';
import Html from './Html';
import logger from '../logger';
import getPage from '.';
import Helmet from '../../src/Helmet/Helmet';

const RoutedError = props => (
  <Layout plain>
    <Helmet />
    <ErrorPage {...props} />
  </Layout>
);

RoutedError.propTypes = {};
// eslint-disable-next-line no-unused-vars
export const errorHandler = (err, req, res, next) =>
  Promise.resolve()
    .then(async () => {
      logger.log(err);
      try {
        const notice = (await logger.error(err)) || {};

        const page = await getPage({
          plain: true,
          req,
          component: <RoutedError errorId={notice.id} />
        });
        return res.send(Html(...page));
      } catch (error) {
        return res.status(404).send("Sorry can't find that!");
      }
    })
    .catch(() => res.status(404).send("Sorry can't find that!"));

export default RoutedError;
