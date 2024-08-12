import { firebaseWeb3Connect } from './firebase-web3connect.service';

export function setupConnectTab(element: HTMLDivElement) {
	element.innerHTML = `
    <button id="connectUI">Connect with UI</button>
  `;
	element.querySelector('#connectUI')?.addEventListener('click', async () => {
		await firebaseWeb3Connect
			.connectWithUI(true)
			.then(userInfo => {
				console.log('connected with UI: ', userInfo);
			})
			.catch(err => {
				console.error('error from component app; ', err);
			});
	});
}
