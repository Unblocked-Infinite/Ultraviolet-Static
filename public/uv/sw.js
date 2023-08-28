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
    <script>
    function createTopBar() {
      // Create the top bar element
      const topBar = document.createElement('div');
      topBar.classList.add('top-bar');
      topBar.textContent = 'Back to Homepage';
      topBar.onclick = () => {
        // Redirect to the homepage
        window.location.href = "/home.html";
      };
  
      // Add styles for the top bar
      const style = document.createElement('style');
      style.textContent =
        ".top-bar { " +
        "position: fixed; " +
        "top: 0; " +
        "left: 0; " +
        "width: 100%; " +
        "height: 30px; " +
        "background-color: #222; " +
        "color: #fff; " +
        "text-align: center; " +
        "padding: 10px; " +
        "box-sizing: border-box; " +
        "font-size: 16px; " +
        "font-family: 'Arial', sans-serif; " +
        "cursor: pointer; " +
        "z-index: 9999; " +
        "transition: background-color 0.3s; " +
        "} " +
        ".top-bar:hover { " +
        "background-color: #444; " +
        "}";
  
      // Append the top bar and styles to the document head
      document.head.appendChild(style);
      document.body.insertBefore(topBar, document.body.firstChild);
    }
  
    // Call the function to create the top bar
    createTopBar();
  </script>
  `;

  const modifiedResponse = new Response(modifiedText, {
    status: response.status,
    statusText: response.statusText,
    headers: response.headers
  });

  return modifiedResponse;
}
