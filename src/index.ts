import { getApp } from './app';
import { getConfig } from './config';

const config = getConfig();
const options = getApp(config);
const server = Bun.serve(options);
console.log(`Listening on http://localhost:${server.port}`);
