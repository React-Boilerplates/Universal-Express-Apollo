const modifyHistory = () => {
  const sendMsgToSw = msg => {
    if (navigator.serviceWorker.controller) {
      navigator.serviceWorker.controller.postMessage(msg);
    }
  };

  const addHtmlToCache = () =>
    sendMsgToSw({
      content: '<!DOCTYPE html>' + document.body.parentElement.outerHTML,
      path: document.location.toString(),
      type: 'html'
    });
  addHtmlToCache();
  (function(history) {
    const pushState = history.pushState;
    history.pushState = function(state) {
      if (typeof history.onpushstate === 'function') {
        history.onpushstate({ state });
      }
      // ... whatever else you want to do
      // maybe call onhashchange e.handler
      return pushState.apply(history, arguments);
    };
  })(window.history);
  history.onpushstate = window.onpopstate = () => {
    setTimeout(addHtmlToCache, 500);
  };
  return sendMsgToSw;
};

export default modifyHistory();
