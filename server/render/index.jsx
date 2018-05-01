import { ServerStyleSheet } from 'styled-components';
import { getLoadableState } from 'loadable-components/server';
import { getDataFromTree } from 'react-apollo';
import { Helmet } from 'react-helmet';
import ReactDOMServer from 'react-dom/server';
import fetch from 'isomorphic-unfetch';

const getPage = async ({
  req,
  amp,
  component,
  client,
  store,
  plain = false
}) => {
  const fullUrl = `${req.protocol}://${req.get('host')}`;
  const styleUrl = `${fullUrl}/assets/styles.css`; // canceling poor styling ``
  try {
    const [sheet, loadableState] = await Promise.all([
      new ServerStyleSheet(),
      !plain && getLoadableState(component)
    ]);
    const [style] = await Promise.all([
      amp
        ? fetch(styleUrl).then(response => response.text())
        : Promise.resolve(''),
      !plain && getDataFromTree(component)
    ]);

    const html = ReactDOMServer.renderToString(sheet.collectStyles(component));
    const helmet = Helmet.renderStatic();
    const styles = sheet.getStyleTags();
    return [
      html,
      {
        title: helmet.title.toString(),
        meta: helmet.meta.toString(),
        link: helmet.link.toString(),
        amp,
        path: req.path,
        style: `${styles}<style>${style}</style>`,
        htmlAttributes: helmet.htmlAttributes.toString(),
        bodyAttributes: helmet.bodyAttributes.toString(),
        bodyScript: `<script>window.__REDUX__ = ${
          store ? JSON.stringify(store.getState()) : '{}'
        }</script>${loadableState ? loadableState.getScriptTag() : ''}`,
        cache: client ? client.cache : false
      }
    ];
  } catch (e) {
    throw e;
  }
};

export default getPage;
