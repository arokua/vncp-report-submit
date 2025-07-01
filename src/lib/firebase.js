import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyDSFBKoUoPWH8wH5xHni05mThmndOAiZtA",
    authDomain: "vncp-submit-report.firebaseapp.com",
    projectId: "vncp-submit-report",
    storageBucket: "vncp-submit-report.firebasestorage.app",
    messagingSenderId: "579753325994",
    appId: "1:579753325994:web:1c34e1e008ddeff57f67d3",
    measurementId: "G-DH19MG1YZ1"
  };

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
