import App from './App.svelte';
import './app.css';
import './lib/stream';

const app = new App({
	target: document.getElementById('app')
});

export default app;
