import * as Firebase from 'firebase/app';
import 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyAh2WQ8HEDR06UjwZ4KsuZN9NaprG1tBX8",
  authDomain: "instgram-e9105.firebaseapp.com",
  databaseURL: "https://instgram-e9105.firebaseio.com",
  projectId: "instgram-e9105",
  storageBucket: "instgram-e9105.appspot.com",
  messagingSenderId: "863308269268",
  appId: "1:863308269268:web:9083ec69d005ecd6"
};
// Initialize Firebase
export const firebaseApp = Firebase.initializeApp(firebaseConfig);
