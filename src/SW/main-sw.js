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