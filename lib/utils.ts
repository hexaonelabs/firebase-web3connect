import { FirebaseOptions } from 'firebase/app';

export const parseApiKey = (hex: string) => {
	// converte hex string to utf-8 string
	if (!hex || hex.length <= 0) {
		throw new Error('Unexisting API key');
	}
	const json = Buffer.from(hex, 'hex').toString('utf-8');
	const apiKey = JSON.parse(json);
	return apiKey as FirebaseOptions;
};

/**
 * Logger function
 */
export const Logger = {
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	log: (...args: any[]) => {
		if (import.meta.env.MODE === 'production') {
			return;
		}
		console.log(...args);
	},
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	error: (...args: any[]) => {
		if (import.meta.env.MODE === 'production') {
			return;
		}
		console.error(...args);
	},
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	warn: (...args: any[]) => {
		if (import.meta.env.MODE === 'production') {
			return;
		}
		console.warn(...args);
	},
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	info: (...args: any[]) => {
		if (import.meta.env.MODE === 'production') {
			return;
		}
		console.info(...args);
	},
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	debug: (...args: any[]) => {
		if (import.meta.env.MODE === 'production') {
			return;
		}
		console.debug(...args);
	}
};
