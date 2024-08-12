import { Auth, User } from 'firebase/auth';

type Unsubscribe = () => void;

// type User = { uid: string; isAnonymous: boolean };
type UserCredential = { user: User };

export interface IAuthProvider {
	signinWithGoogle: (privateKey?: string) => Promise<User>;
	signInAsAnonymous: () => Promise<UserCredential>;
	signOut: () => Promise<void>;
	getOnAuthStateChanged: (cb: (user: User | null) => void) => Unsubscribe;
	getCurrentUserAuth: () => Promise<User | null>;
	initialize: (auth: Auth, ops?: string) => void;
}
