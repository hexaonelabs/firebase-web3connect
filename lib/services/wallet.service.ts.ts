import evmWallet from '../networks/evm';
import btcWallet from '../networks/bitcoin';
import Crypto from '../providers/crypto/crypto';
import * as authService from '../services/auth.servcie';
import { CHAIN_AVAILABLES, KEYS } from '../constant';
import { storageService } from './storage.service';
import { Web3Wallet } from '../networks/web3-wallet';
import solanaWallet from '../networks/solana';
import { generateMnemonic } from 'bip39';
import { Logger } from '../utils';

export const initWallet = async (
	user: {
		uid: string;
		isAnonymous: boolean;
	} | null,
	secret?: string,
	chainId?: number
): Promise<Web3Wallet> => {
	Logger.log('[INFO] initWallet:', { user, secret });

	if (!secret && user && !user.isAnonymous) {
		// check if secret is stored in local storage
		const encryptedSecret = await storageService.getItem(
			KEYS.STORAGE_SECRET_KEY
		);
		Logger.log('>> no secret > get encryptedSecret:', encryptedSecret);
		if (encryptedSecret) {
			secret = await Crypto.decrypt(
				storageService.getUniqueID(),
				encryptedSecret
			);
		}
	}

	// connect with external wallet
	if (!secret && user && user.isAnonymous === true) {
		const wallet = await evmWallet.connectWithExternalWallet({
			chainId
		});
		return wallet;
	}

	// others methods require _secret.
	// Handle case where _secret is not required
	if (!secret) {
		throw new Error(
			'Secret is required to decrypt the private key and initialize the wallet.'
		);
		// return null;
	}

	// connect using auth service
	// check if encrypted mnemonic is available from storage
	const storedEncryptedMnemonic = await storageService.getItem(
		KEYS.STORAGE_PRIVATEKEY_KEY
	);
	const mnemonic = storedEncryptedMnemonic
		? await Crypto.decrypt(secret, storedEncryptedMnemonic)
		: generateMnemonic();
	let wallet!: Web3Wallet;
	// check if is EVM chain
	const chain = CHAIN_AVAILABLES.find(chain => chain.id === chainId);
	Logger.log('>>>>>', { storedEncryptedMnemonic, mnemonic });
	// generate wallet from encrypted mnemonic or generate new from random mnemonic
	switch (true) {
		// evm wallet
		case chain?.type === 'evm': {
			wallet = await evmWallet.generateWalletFromMnemonic({
				mnemonic,
				chainId
			});
			break;
		}
		// btc wallet
		case chain?.type === 'bitcoin': {
			wallet = await btcWallet.generateWalletFromMnemonic({
				mnemonic
			});
			break;
		}
		// solana wallet
		case chain?.type === 'solana': {
			wallet = await solanaWallet.generateWalletFromMnemonic({
				mnemonic
			});
			break;
		}
		default:
			throw new Error('Unsupported chain type');
	}
	if (!secret) {
		await authService.signOut();
		throw new Error('Secret is required to encrypt the mnemonic.');
	}
	if (!wallet.publicKey) {
		throw new Error('Failed to generate wallet from mnemonic');
	}
	// encrypt mnemonic before storing it
	if (mnemonic) {
		const encryptedMnemonic = await Crypto.encrypt(secret, mnemonic);
		await storageService.setItem(
			KEYS.STORAGE_PRIVATEKEY_KEY,
			encryptedMnemonic
		);
	}
	return wallet;
};
