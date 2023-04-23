// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
import { getStorage } from "firebase/storage";

const config = {
  apiKey: "AIzaSyCRlQyWruO-HhPLIXLbUwe8Re3WCuli_VU",
  authDomain: "codedatabase-819d6.firebaseapp.com",
  databaseURL: "https://codedatabase-819d6-default-rtdb.firebaseio.com",
  projectId: "codedatabase-819d6",
  storageBucket: "codedatabase-819d6.appspot.com",
  messagingSenderId: "420075124138",
  appId: "1:420075124138:web:0020e12a55853d65cf67d3",
  measurementId: "G-QYDJZW417T",
};

const app = initializeApp(config);
const database = getDatabase(app);
const storage = getStorage(app);

module.exports = {
  config,
  database,
  storage,
};
