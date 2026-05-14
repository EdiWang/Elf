import { default as Alpine } from '/lib/alpinejs/dist/module.esm.min.js';

window.Alpine = Alpine;

queueMicrotask(() => Alpine.start());

export { Alpine };
