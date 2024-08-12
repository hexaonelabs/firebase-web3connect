import authProvider from '../providers/auth/firebase';
import Crypto from '../providers/crypto/crypto';
import { KEYS } from '../constant';
import { storageService } from './storage.service';
import { Logger } from '../utils';
import { Auth } from 'firebase/auth';

export const initialize = async (auth: Auth) => {
	authProvider.initialize(auth);
};

export const authWithGoogle = async () => {
	// use authProvider to sign in with Google
	const user = await authProvider.signinWithGoogle();
	return user;
};

export const authWithExternalWallet = async () => {
	Logger.log('authWithExternalWallet');
	const {
		user: { uid }
	} = await authProvider.signInAsAnonymous();
	return { uid };
};

export const authByImportPrivateKey = async (ops: {
	password: string;
	privateKey: string;
}) => {
	const { password, privateKey } = ops;

	// encrypt private key before storing it
	const encryptedPrivateKey = await Crypto.encrypt(password, privateKey);
	await storageService.setItem(
		KEYS.STORAGE_PRIVATEKEY_KEY,
		encryptedPrivateKey
	);
	// trigger Auth with Google
	throw new Error('Not implemented');
};

export const authByImportSeed = async (ops: {
	seed: string;
	password: string;
}) => {
	const { seed, password } = ops;
	// encrypt seed before storing it
	const encryptedSeed = await Crypto.encrypt(password, seed);
	await storageService.setItem(KEYS.STORAGE_PRIVATEKEY_KEY, encryptedSeed);
	// trigger Auth with Google
	throw new Error('Not implemented');
};

export const signOut = async () => {
	await authProvider.signOut();
}

export const onAuthStateChanged = authProvider.getOnAuthStateChanged;