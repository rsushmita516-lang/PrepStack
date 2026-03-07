// firebase.js - initialize Firebase client SDK
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

// Copy the config from the Firebase console (your web app settings)
const firebaseConfig = {
  apiKey: "AIzaSyAxYd7LabvMwAuNKsOh3KlgY56Nv69GYgc",
  authDomain: "prepstack-5aa2e.firebaseapp.com",
  projectId: "prepstack-5aa2e",
  storageBucket: "prepstack-5aa2e.firebasestorage.app",
  messagingSenderId: "234286508094",
  appId: "1:234286508094:web:26370aeb71850bc7a6c96f",
  measurementId: "G-5WQWJFQHQJ",
  databaseURL:'https://console.firebase.google.com/u/0/project/prepstack-5aa2e/database/prepstack-5aa2e-default-rtdb/data/~2F?fb_gclid=CjwKCAiAzZ_NBhAEEiwAMtqKy4LLIAatZ3JVKkUR1HVVod-MALSMMxZC3SjAJEwjEjNjhn7o5Zpr_RoCGYAQAvD_BwE&fb_utm_campaign=Cloud-SS-DR-Firebase-FY26-global-gsem-1713590&fb_utm_content=text-ad&fb_utm_medium=cpc&fb_utm_source=google&fb_utm_term=KW_firebase'
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
