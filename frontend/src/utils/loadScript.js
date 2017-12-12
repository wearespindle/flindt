const cache = {};
const head = document.querySelector('head');

export default function(uri) {
  if (uri in cache) {
    return cache[uri];
  }

  const inDom = document.querySelector(`script[src='${uri}']`);
  if (inDom) {
    return Promise.resolve();
  }

  const promise = new Promise((resolve, reject) => {
    const script = document.createElement('script');

    script.addEventListener('load', () => {
      resolve();
    });

    script.addEventListener('error', () => {
      reject();
    });

    script.src = uri;
    head.appendChild(script);
  });

  cache[uri] = promise;

  return promise;
}
