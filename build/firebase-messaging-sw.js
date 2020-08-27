"use strict";var precacheConfig=[["/index.html","8599c61d615d31dd889b7e7616a5eab0"],["/static/css/main.865c03c8.css","bc276cc6aea7d44c35fca7678e7531a2"],["/static/media/Raleway-Bold.3b1a9a7b.ttf","3b1a9a7b05c1e411253797b2fa3d1e91"],["/static/media/Raleway-Medium.fa56e8c1.ttf","fa56e8c122bb66dbcb913e416bb54c97"],["/static/media/Raleway-Regular.6e4a9679.ttf","6e4a9679e65cc320746c3e5d48e51f28"],["/static/media/conLogo.101c800b.png","101c800bd463ae77f6d36633d1b33f16"],["/static/media/defaultImage.72556c96.png","72556c96d739b9fa14490fa38094894d"],["/static/media/fa-brands-400.13db00b7.eot","13db00b7a34fee4d819ab7f9838cc428"],["/static/media/fa-brands-400.a046592b.woff","a046592bac8f2fd96e994733faf3858c"],["/static/media/fa-brands-400.a1a749e8.svg","a1a749e89f578a49306ec2b055c073da"],["/static/media/fa-brands-400.c5ebe0b3.ttf","c5ebe0b32dc1b5cc449a76c4204d13bb"],["/static/media/fa-brands-400.e8c322de.woff2","e8c322de9658cbeb8a774b6624167c2c"],["/static/media/fa-regular-400.701ae6ab.eot","701ae6abd4719e9c2ada3535a497b341"],["/static/media/fa-regular-400.82f60bd0.svg","82f60bd0b94a1ed68b1e6e309ce2e8c3"],["/static/media/fa-regular-400.ad97afd3.ttf","ad97afd3337e8cda302d10ff5a4026b8"],["/static/media/fa-regular-400.cd6c777f.woff2","cd6c777f1945164224dee082abaea03a"],["/static/media/fa-regular-400.ef60a4f6.woff","ef60a4f6c25ef7f39f2d25a748dbecfe"],["/static/media/fa-solid-900.0ab54153.woff2","0ab54153eeeca0ce03978cc463b257f7"],["/static/media/fa-solid-900.8e3c7f55.eot","8e3c7f5520f5ae906c6cf6d7f3ddcd19"],["/static/media/fa-solid-900.962a1bf3.svg","962a1bf31c081691065fe333d9fa8105"],["/static/media/fa-solid-900.b87b9ba5.ttf","b87b9ba532ace76ae9f6edfe9f72ded2"],["/static/media/fa-solid-900.faff9214.woff","faff92145777a3cbaf8e7367b4807987"],["/static/media/instalaciones3.681c8bf4.jpeg","681c8bf4c83527ec8bfb25e787b45e6a"],["/static/media/live.b8cfd060.gif","b8cfd060fab7dcabfab42419b09bcb41"],["/static/media/loader.49430557.gif","49430557645a4cf7871ebbbc47465406"],["/static/media/puntaje.b9cd5dec.png","b9cd5decf3dfe37b0e9a1901a73fee47"]],cacheName="sw-precache-v3-sw-precache-webpack-plugin-"+(self.registration?self.registration.scope:""),ignoreUrlParametersMatching=[/^utm_/],addDirectoryIndex=function(e,a){var t=new URL(e);return"/"===t.pathname.slice(-1)&&(t.pathname+=a),t.toString()},cleanResponse=function(a){return a.redirected?("body"in a?Promise.resolve(a.body):a.blob()).then(function(e){return new Response(e,{headers:a.headers,status:a.status,statusText:a.statusText})}):Promise.resolve(a)},createCacheKey=function(e,a,t,c){var n=new URL(e);return c&&n.pathname.match(c)||(n.search+=(n.search?"&":"")+encodeURIComponent(a)+"="+encodeURIComponent(t)),n.toString()},isPathWhitelisted=function(e,a){if(0===e.length)return!0;var t=new URL(a).pathname;return e.some(function(e){return t.match(e)})},stripIgnoredUrlParameters=function(e,t){var a=new URL(e);return a.hash="",a.search=a.search.slice(1).split("&").map(function(e){return e.split("=")}).filter(function(a){return t.every(function(e){return!e.test(a[0])})}).map(function(e){return e.join("=")}).join("&"),a.toString()},hashParamName="_sw-precache",urlsToCacheKeys=new Map(precacheConfig.map(function(e){var a=e[0],t=e[1],c=new URL(a,self.location),n=createCacheKey(c,hashParamName,t,/\.\w{8}\./);return[c.toString(),n]}));function setOfCachedUrls(e){return e.keys().then(function(e){return e.map(function(e){return e.url})}).then(function(e){return new Set(e)})}self.addEventListener("install",function(e){e.waitUntil(caches.open(cacheName).then(function(c){return setOfCachedUrls(c).then(function(t){return Promise.all(Array.from(urlsToCacheKeys.values()).map(function(a){if(!t.has(a)){var e=new Request(a,{credentials:"same-origin"});return fetch(e).then(function(e){if(!e.ok)throw new Error("Request for "+a+" returned a response with status "+e.status);return cleanResponse(e).then(function(e){return c.put(a,e)})})}}))})}).then(function(){return self.skipWaiting()}))}),self.addEventListener("activate",function(e){var t=new Set(urlsToCacheKeys.values());e.waitUntil(caches.open(cacheName).then(function(a){return a.keys().then(function(e){return Promise.all(e.map(function(e){if(!t.has(e.url))return a.delete(e)}))})}).then(function(){return self.clients.claim()}))}),self.addEventListener("fetch",function(a){if("GET"===a.request.method){var e,t=stripIgnoredUrlParameters(a.request.url,ignoreUrlParametersMatching),c="index.html";(e=urlsToCacheKeys.has(t))||(t=addDirectoryIndex(t,c),e=urlsToCacheKeys.has(t));var n="/index.html";!e&&"navigate"===a.request.mode&&isPathWhitelisted(["^(?!\\/__).*"],a.request.url)&&(t=new URL(n,self.location).toString(),e=urlsToCacheKeys.has(t)),e&&a.respondWith(caches.open(cacheName).then(function(e){return e.match(urlsToCacheKeys.get(t)).then(function(e){if(e)return e;throw Error("The cached response that was expected is missing.")})}).catch(function(e){return console.warn('Couldn\'t serve response for "%s" from cache: %O',a.request.url,e),fetch(a.request)}))}});
importScripts("https://www.gstatic.com/firebasejs/5.9.4/firebase-app.js");
importScripts("https://www.gstatic.com/firebasejs/5.9.4/firebase-messaging.js");
const firebaseConfig = {
    apiKey: "AIzaSyCLTKt2aDjytuj2WkiOMtHKcJzhdwxRRMo",
    authDomain: "sirar-con.firebaseapp.com",
    databaseURL: "https://sirar-con.firebaseio.com",
    projectId: "sirar-con",
    storageBucket: "sirar-con.appspot.com",
    messagingSenderId: "449107717413",
    appId: "1:449107717413:web:9ea824df52cf83ac987ecc",
    measurementId: "G-MK2WSZ1XQC"
};
firebase.initializeApp(firebaseConfig);
const messaging = firebase.messaging();
messaging.setBackgroundMessageHandler(function(payload) {
     const promiseChain = clients
          .matchAll({
               type: "window",
               includeUncontrolled: true,
          })
          .then((windowClients) => {
               for (let i = 0; i < windowClients.length; i++) {
                    const windowClient = windowClients[i];
                    windowClient.postMessage(payload);
               }
          })
          .then(() => {
               return registration.showNotification("my notification title");
          });
     return promiseChain;
});
self.addEventListener('fetch', function(event) {
  if(event.request.method == 'GET' && !event.request.url.includes('api/')) {
    event.respondWith(
      caches.open(cacheName).then(function(cache) {
        return fetch(event.request).then(function(response) {
          cache.put(event.request, response.clone());
          return response;
        });
      })
    );
    return;
  }
  return
});