import { createApp } from 'vue'
import App from './App.vue'

import './assets/main.css'
import router from './router'

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCVLnyjdSx5nmVr7N3oItwnsPHJOSrf1A8",
  authDomain: "materialbank-2b0cb.firebaseapp.com",
  projectId: "materialbank-2b0cb",
  storageBucket: "materialbank-2b0cb.appspot.com",
  messagingSenderId: "1035474204951",
  appId: "1:1035474204951:web:cadc257faaff8f6ed81f52"
};

// Initialize Firebase
initializeApp(firebaseConfig);

const app = createApp(App);

app.use(router).mount('#app')