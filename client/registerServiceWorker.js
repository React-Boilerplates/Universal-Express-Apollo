const swUrl = '/sw.js';

const registerServiceWorker = () => {
  const result = navigator.serviceWorker
    .register(swUrl)
    // .then(console.log)
    .catch(() => Promise.resolve());
  return result;
};

export default registerServiceWorker();
