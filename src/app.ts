import { Hono } from 'hono';
import type { Serve } from 'bun';
import { createBunWebSocket } from 'hono/bun';

import type { Config } from './config';
import { Controller } from './controller';
import { Home, Pods } from './components';

export const getApp = (config: Config): Serve<any> => {
  const controller = new Controller(config);

  const { upgradeWebSocket, websocket } = createBunWebSocket();

  const app = new Hono();

  app.get('/', async (c) => c.html(Home));

  app.get(
    '/ws',
    upgradeWebSocket((c) => {
      let timeoutId: Timer;
      return {
        onOpen(_, ws) {
          const run = async () => {
            const pods = await controller.getPods();
            ws.send(Pods(pods).toString());
            timeoutId = setTimeout(run, 5000);
          };
          run();
        },
        onClose() {
          clearTimeout(timeoutId);
        },
      };
    }),
  );

  return {
    port: config.port,
    fetch: app.fetch,
    websocket,
  };
};
