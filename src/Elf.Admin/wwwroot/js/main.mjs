import { setTheme } from 'https://unpkg.com/@fluentui/web-components@3.0.0-rc.15/dist/web-components.min.js';
import { webLightTheme } from 'https://unpkg.com/@fluentui/tokens@1.0.0-alpha.23/lib/index.js';

setTheme(webLightTheme);

document.addEventListener('click', event => {
	const closeButton = event.target.closest('[data-dialog-close]');
	if (!closeButton) return;

	closeButton.closest('dialog')?.close();
});
