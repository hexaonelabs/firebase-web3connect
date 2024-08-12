import { setupAccountTab } from './account';
import { setupConnectTab } from './connect';
import {
	firebaseWeb3Connect,
} from './firebase-web3connect.service';
import './style.css';

console.log('[INFO] App demo initialization...', import.meta.env);
// get the root app element and check if it exists
const app = document.querySelector<HTMLDivElement>('#app');
if (!app) {
	throw new Error('no root app provided');
}

// setup the UI using FirebaseWeb3Connect.onConnectStateChanged() callback
firebaseWeb3Connect.onConnectStateChanged(async user => {
	if (user) {
		setupAccountTab(app, firebaseWeb3Connect);
	} else {
		setupConnectTab(app);
	}
});

