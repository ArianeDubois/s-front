export default defineNuxtPlugin(() => {
  if (process.client) {
    const gtmIframe = document.createElement('iframe');
    gtmIframe.src = 'https://www.googletagmanager.com/ns.html?id=GTM-5DLGB6XV';
    gtmIframe.height = '0';
    gtmIframe.width = '0';
    gtmIframe.style = 'display:none;visibility:hidden';
    document.body.appendChild(gtmIframe);
  }
});
