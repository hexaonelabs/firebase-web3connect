import {
	GoogleAuthProvider,
	signInWithPopup,
	signInAnonymously,
	signOut as signOutFormFirebase,
	Auth,
	onAuthStateChanged as onAuthStateChangedFirebase,
	User,
	UserCredential,
} from 'firebase/auth';
import { IAuthProvider } from '../../interfaces/auth-provider.interface';

let auth!: Auth;

const signinWithGoogle = async (): Promise<UserCredential> => {
	const provider = new GoogleAuthProvider();
	return await signInWithPopup(auth, provider);
};

const signInAsAnonymous = async () => {
	return await signInAnonymously(auth);
};

const signOut = async () => {
	await signOutFormFirebase(auth);
};

const initialize = (_auth: Auth) => {
	auth = _auth;
};

const getOnAuthStateChanged = (cb: (user: User | null) => void) =>
	onAuthStateChangedFirebase(auth, user => cb(user));

const getCurrentUserAuth = async () => {
	return auth.currentUser;
};

/**
 * Firebase Auth Provider
 * Only use this provider from the authServices!
 */
const FirebaseAuthProvider: IAuthProvider = {
	signinWithGoogle,
	signInAsAnonymous,
	signOut,
	getOnAuthStateChanged,
	getCurrentUserAuth,
	initialize
};

export default FirebaseAuthProvider;
