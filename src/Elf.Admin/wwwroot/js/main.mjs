import { setTheme } from 'https://unpkg.com/@fluentui/web-components@3.0.0-rc.17/dist/web-components.min.js';
import { webLightTheme } from '/lib/fluentui/tokens/lib/index.js';

setTheme(webLightTheme);

document.addEventListener('click', event => {
	const closeButton = event.target.closest('[data-dialog-close]');
	if (!closeButton) return;

	const fluentDialog = closeButton.closest('fluent-dialog');
	if (fluentDialog) {
		if (fluentDialog.dataset.dialogOpen === 'false') return;

		fluentDialog.hide();
		fluentDialog.dataset.dialogOpen = 'false';
		fluentDialog.dispatchEvent(new CustomEvent('close'));
		return;
	}

	closeButton.closest('dialog')?.close();
});

const navbarTime = document.getElementById('navbarTime');
if (navbarTime) {
	const updateNavbarTime = () => {
		const now = new Date();
		const date = now.toLocaleDateString(undefined, { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' });
		const time = now.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' });
		navbarTime.textContent = `${date} · ${time}`;
	};

	updateNavbarTime();
	setInterval(updateNavbarTime, 60_000);
}
