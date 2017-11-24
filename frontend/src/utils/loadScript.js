export default function(uri) {
  if (window && document) {
    return new Promise((resolve, reject) => {
      const head = document.querySelector('head');
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
  }

  return Promise.resolve();
}
