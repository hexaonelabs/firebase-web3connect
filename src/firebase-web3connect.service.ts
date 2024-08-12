import { FirebaseWeb3Connect } from '../lib';
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import firebaseConfig  from '../firebase.config.json';

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// Initialize Firebase Auth
const auth = getAuth(app);

// Initialize local instance of FirebaseWeb3Connect
export const firebaseWeb3Connect = new FirebaseWeb3Connect(auth, 'APIKEY', {
	chainId: 11155111
});
