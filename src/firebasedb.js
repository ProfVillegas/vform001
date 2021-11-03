// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyBTsr63z70IDb6XlNna6HFWEWNVVeM8_HM",
    authDomain: "mastercoil.firebaseapp.com",
    projectId: "mastercoil",
    storageBucket: "mastercoil.appspot.com",
    messagingSenderId: "284619012928",
    appId: "1:284619012928:web:9059fbb8def114dc2618a5",
    measurementId: "G-RP6ZZCDFLF"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);