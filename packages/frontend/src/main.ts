// packages/frontend/src/main.ts
import './app.css';
import { mount } from 'svelte';
import App from './App.svelte';
import { initStatsListener } from './stores/stats-store';

// Initialize message listener from backend
initStatsListener();

// Mount the app using Svelte 5 API
const target = document.getElementById('app');
let app;
if (target) {
  app = mount(App, { target });
}

export default app;
