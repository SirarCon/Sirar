import * as firebase from "firebase/app";
import "firebase/messaging";
const initializedFirebaseApp = firebase.initializeApp({
     // Project Settings => Add Firebase to your web app
     apiKey: "AIzaSyCLTKt2aDjytuj2WkiOMtHKcJzhdwxRRMo",
    authDomain: "sirar-con.firebaseapp.com",
    databaseURL: "https://sirar-con.firebaseio.com",
    projectId: "sirar-con",
    storageBucket: "sirar-con.appspot.com",
    messagingSenderId: "449107717413",
    appId: "1:449107717413:web:9ea824df52cf83ac987ecc",
    measurementId: "G-MK2WSZ1XQC"
});
var messaging = null
if (firebase.messaging.isSupported())
    messaging = initializedFirebaseApp.messaging();
export { messaging };