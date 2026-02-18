// packages/frontend/src/main.ts
import './app.css';
import App from './App.svelte';
import { initStatsListener } from './stores/stats-store';

// Initialize message listener from backend
initStatsListener();

// Mount the app
const app = new App({
  target: document.getElementById('app')!,
});

export default app;
