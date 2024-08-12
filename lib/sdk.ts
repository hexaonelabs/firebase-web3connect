import storageProvider from './providers/storage/local';
import * as authService from './services/auth.servcie'; 

import {
	CHAIN_AVAILABLES,
	DEFAULT_SIGNIN_METHODS,
} from './constant';
import { Auth } from 'firebase/auth';
import { SDKOptions } from './interfaces/sdk.interface.ts';
import { storageService } from './services/storage.service.ts';
import { Web3Wallet } from './networks/web3-wallet.ts';
import { Logger } from './utils.ts';
import {
	initialize as initializeRealtimeDB,
	set
} from './providers/storage/firebase.ts';

export class FirebaseWeb3Connect {
	private readonly _apiKey!: string;
	private _ops?: SDKOptions;
	private _secret!: string | undefined;
	private _uid!: string | undefined;
	private _cloudBackupEnabled!: boolean | undefined;
	private _wallet!: Web3Wallet | undefined;
	private _wallets: Web3Wallet[] = [];

	get provider() {
		return this._wallet?.provider;
	}

	get userInfo() {
		return this._wallet
			? {
					address: this._wallet.address,
					publicKey: this._wallet.publicKey,
					chainId: this._wallet.chainId,
					uid: this._uid,
					cloudBackupEnabled: this._cloudBackupEnabled
				}
			: null;
	}

	get wallet() {
		return this._wallet;
	}

	constructor(auth: Auth, apiKey: string, ops?: SDKOptions) {
		this._apiKey = apiKey; // parseApiKey(apiKey.slice(2));
		this._ops = {
			enabledSigninMethods: DEFAULT_SIGNIN_METHODS,
			...ops
		};
		// initialize service dependencies
		authService.initialize(auth);
		// set storage.uid
		storageService.initialize(this._ops?.storageService || storageProvider);
		// init realtimeDatabase users collection
		initializeRealtimeDB(auth.app);
		// check if window is available and HTMLDialogElement is supported
		if (!window || !window.HTMLDialogElement) {
			throw new Error(
				'[ERROR] FirebaseWeb3Connect: HTMLDialogElement not supported'
			);
		}
		Logger.log(`[INFO] FirebaseWeb3Connect initialized and ready!`, {
			config: this._ops,
			mode: import.meta.env.MODE,
			apiKey: this._apiKey,
			auth
		});
	}

	public async connectWithUI() {
		await authService.authWithGoogle();
		return this.userInfo;
	}

	public async signout() {
		await authService.signOut();
	}

	public async backupWallet() {
		await storageService.executeBackup(
			this._secret ? true : false,
			this._secret
		);
	}

	/**
	 * Method that manage the entire wallet management process base on user state.
	 * Wallet values are set with the corresponding method base on the user authentication provider.
	 * If no user is connected, all wallet values are set to null with a default provider and the method will return null.
	 *
	 * @param cb Call back function that return the formated user information to the caller.
	 * @returns
	 */
	public onConnectStateChanged(cb: (user: { address: string } | null) => void) {
		return authService.onAuthStateChanged(async user => {
			this._uid = user?.uid;

			if (!this.userInfo && user) {
				// 1: init wallet base on user state
				
				// 2: set secret if undefined and stored in service

			}

			if (
				user?.uid &&
				!user?.isAnonymous &&
				import.meta.env.MODE === 'production'
			) {
				await set(user.uid, {
					email: user.email,
					emailVerified: user.emailVerified,
					uid: user.uid,
					providerId: user.providerId,
					providerData: user.providerData[0]?.providerId,
					metaData: user.metadata
				});
			}

			// reset state if no user connected
			if (!user) {
				this._secret = undefined;
				this._wallet = undefined;
				this._cloudBackupEnabled = undefined;
				this._uid = undefined;
			}
			Logger.log('[INFO] onConnectStateChanged:', {
				user,
				userInfo: this.userInfo,
				provider: this.provider,
				_secret: this._secret
			});
			cb(user ? this.userInfo : null);
		});
	}

	public async switchNetwork(chainId: number) {
		if (!this._uid) {
			throw new Error('User not connected');
		}
		// prevent switching to the same chain
		if (this._wallet?.chainId === chainId) {
			return this.userInfo;
		}
		const chain = CHAIN_AVAILABLES.find(chain => chain.id === chainId);
		// check if an existing Wallet is available
		const wallet = this._wallets.find(
			wallet =>
				wallet.chainId === chainId ||
				CHAIN_AVAILABLES.find(chain => chain.id === wallet.chainId)?.type ===
					chain?.type
		);
		Logger.log(`[INFO] switchNetwork:`, { wallet, wallets: this._wallets });
		if (wallet) {
			// check if wallet type have same chainId or switch
			if (wallet.chainId !== chainId) {
				await wallet.switchNetwork(chainId);
			}
			this._wallet = wallet;
		} else {
			// If not existing wallet, init new wallet with chainId
			await this._initWallet(
				{
					isAnonymous: Boolean(this._wallet?.publicKey),
					uid: this._uid
				},
				chainId
			);
		}
		return this.userInfo;
	}

	/**
	 * Method that initialize the main EVM wallet and all other type, base on the user state.
	 */
	private async _initWallets(user: { uid: string; isAnonymous: boolean }) {
		if (!user) {
			throw new Error(
				'User not connected. Please sign in to connect with wallet'
			);
		}
		
	}

	/**
	 * Method that add a new wallet to the wallet list and set the wallet as the main wallet.
	 */
	private async _initWallet(
		user: {
			uid: string;
			isAnonymous: boolean;
		},
		chainId: number
	) {
		Logger.log('[INFO] initWallet:', { chainId });
		if (!user) {
			throw new Error(
				'User not connected. Please sign in to connect with wallet'
			);
		}
		// generate wallet base on user state and chainId & 
		// add to wallet list & as curent wallet
		throw new Error('Not implemented');
		return this.userInfo;
	}


}
