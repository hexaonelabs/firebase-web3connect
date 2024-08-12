import { NETWORK } from '../lib/constant';
import { firebaseWeb3Connect } from './firebase-web3connect.service';

export function setupAccountTab(
	element: HTMLDivElement,
	web3Wallet: typeof firebaseWeb3Connect
) {
	// let signature!: string;
	element.innerHTML = `
    <h1>Connected</h1>
    <p id="address">${web3Wallet?.userInfo?.address}</p>
    <button id="signout">signout</button><br/>

		<h2>Backup Wallet</h2>
		<button id="backup__btn">Download Backup file</button>
		<button id="store_backup__btn">Store Backup file</button>

		<h2>Switch Network</h2>
		<p>Current chain: <span id="currentChain">${web3Wallet?.userInfo?.chainId} ${NETWORK[Number(web3Wallet?.userInfo?.chainId)]}</span></p>
		<div id="switchNetwork">
			<button id="btc">btc</button>
			<button id="eth">eth</button>
			<button id="bsc">bsc</button>
			<button id="pol">pol</button>
			<button id="op">op</button>
			<button id="sol">sol</button><br/>
		</div>

		<h2>Sign and Verify</h2>
		<input type="text" id="content" placeholder="Enter content to sign" />
		<button id="sign">Sign message</button><br/>
		<input type="text" id="signature" placeholder="Enter signature" />
		<button id="verify">Verify signature</button>
		<pre id="verifyResult"></pre>

		<h2>Send Transaction</h2>
		<input type="text" id="to" placeholder="Enter receiver address" />
		<input type="number" id="value" placeholder="Enter value" />
		<button id="send">Send transaction</button>
		<pre></pre>
  `;

	element.querySelector('#sign')?.addEventListener('click', async () => {
		const contentElement = element.querySelector(
			'#content'
		) as HTMLInputElement;
		// use etherjs to sign the message
		const signature = await firebaseWeb3Connect?.wallet?.signMessage(
			contentElement?.value
		);
		(element.querySelector('#signature') as HTMLInputElement).value =
			`${signature}`;
	});

	element.querySelector('#verify')?.addEventListener('click', async () => {
		const contentElement = element.querySelector(
			'#content'
		) as HTMLInputElement;
		// Verify the signature with address
		const isValid = firebaseWeb3Connect.wallet?.verifySignature(
			`${contentElement.value}`,
			(element.querySelector('#signature') as HTMLInputElement).value
		);
		console.log('Signature is valid:', isValid);
		(element.querySelector('pre#verifyResult') as HTMLPreElement).innerHTML =
			`Signature isValid: ${isValid}`;
	});

	element.querySelector('#signout')?.addEventListener('click', async () => {
		await web3Wallet.signout();
	});

	element.querySelector('#backup__btn')?.addEventListener('click', async () => {
		await firebaseWeb3Connect.backupWallet();
	});
	element
		.querySelector('#store_backup__btn')
		?.addEventListener('click', async () => {
			alert(`Premium feature not implemented yet.`);
		});

	element
		.querySelector('#switchNetwork')
		?.addEventListener('click', async e => {
			const target = e.target as HTMLButtonElement;
			switch (true) {
				case target.id === 'btc': {
					await firebaseWeb3Connect.switchNetwork(NETWORK.bitcoin);
					break;
				}
				case target.id === 'eth': {
					await firebaseWeb3Connect.switchNetwork(NETWORK.mainnet);
					break;
				}
				case target.id === 'bsc': {
					await firebaseWeb3Connect.switchNetwork(NETWORK.binancesmartchain);
					break;
				}
				case target.id === 'pol': {
					await firebaseWeb3Connect.switchNetwork(NETWORK.polygon);
					break;
				}
				case target.id === 'op': {
					await firebaseWeb3Connect.switchNetwork(NETWORK.optimism);
					break;
				}
				case target.id === 'sol': {
					await firebaseWeb3Connect.switchNetwork(NETWORK.solana);
					break;
				}
			}
			const currentChainElement = element.querySelector(
				'#currentChain'
			) as HTMLSpanElement;
			const chainId = firebaseWeb3Connect.wallet?.chainId;
			currentChainElement.innerText = `${chainId} ${NETWORK[Number(chainId)]}`;
			// update adderss
			const addressElement = element.querySelector(
				'#address'
			) as HTMLParagraphElement;
			addressElement.innerText = `${firebaseWeb3Connect.wallet?.address}`;
		});
	element.querySelector('#send')?.addEventListener('click', async () => {
		const toElement = element.querySelector('#to') as HTMLInputElement;
		const valueElement = element.querySelector('#value') as HTMLInputElement;
		const tx = {
			to: toElement.value,
			value: valueElement.value
		};
		console.log('tx:', tx);
		const isConfirm = confirm(
			`Send amount of ${valueElement.value} to ${toElement.value}. Are you sure?`
		);
		if (!isConfirm) {
			return;
		}
		const response = await firebaseWeb3Connect.wallet?.sendTransaction(tx);
		console.log('response:', response);
	});
}
