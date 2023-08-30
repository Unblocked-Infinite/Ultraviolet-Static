importScripts('uv.bundle.js');
importScripts('uv.config.js');
importScripts(__uv$config.sw || 'uv.sw.js');

const sw = new UVServiceWorker();

self.addEventListener('fetch', (event) => {
  event.respondWith(handleFetchEvent(event));
});

async function handleFetchEvent(event) {
  const response = await sw.fetch(event);

  if (response.ok && response.headers.get('content-type').includes('text/html')) {
    const modifiedResponse = await modifyPageContent(response.clone());
    return modifiedResponse;
  }

  return response;
}

async function modifyPageContent(response) {
  const text = await response.text();

  // Modify the HTML to inject the ad-blocking script and the improved galaxy-themed JavaScript GUI with pre-installed scripts
  const modifiedText = `
    ${text}

  `;

  const modifiedResponse = new Response(modifiedText, {
    status: response.status,
    statusText: response.statusText,
    headers: response.headers
  });

  return modifiedResponse;
}
