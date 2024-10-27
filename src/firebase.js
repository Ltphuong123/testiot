import { initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';
import { getAuth } from 'firebase/auth';

// Cấu hình Firebase của bạn
const firebaseConfig = {
  apiKey: "AIzaSyAT7z6iASoRsnqu5ZuIPmioIJKWJ1cLTLY",
  authDomain: "btliot-6cba2.firebaseapp.com",
  databaseURL: "https://btliot-6cba2-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "btliot-6cba2",
  storageBucket: "btliot-6cba2.appspot.com",
  messagingSenderId: "89623948014",
  appId: "1:89623948014:web:ff600f488beb3a458561ff",
  measurementId: "G-T57SRCBQ2E"
};

// Khởi tạo Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);
const auth = getAuth(app);

export { database, auth };
