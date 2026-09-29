import { createApp } from './app.js';
import { loadConfig } from './config.js';

const config = loadConfig(process.env);

createApp(config).listen(config.port, () => {
  console.log(`API listening on http://localhost:${config.port}`);
});
