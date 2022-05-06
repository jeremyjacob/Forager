import App from './App.svelte';
import './app.css';
import './lib/stream';

const app = new App({
	target: document.getElementById('app')
});

if (
	localStorage.theme === 'dark' ||
	(!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)
) {
	document.documentElement.classList.add('dark');
} else {
	document.documentElement.classList.remove('dark');
}

export default app;
