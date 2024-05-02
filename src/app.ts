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

  app.get('/', async (c) => {
    const viewType = c.req.query('table') != undefined ? 'table' : 'grid';

    return c.html(Home(viewType));
  });

  app.get(
    '/ws',
    upgradeWebSocket((c) => {
      let timeoutId: Timer;
      return {
        onOpen(_, ws) {
          const viewType = c.req.query('view') === 'table' ? 'table' : 'grid';

          const run = async () => {
            const pods = await controller.getPods();
            ws.send(Pods(pods, viewType).toString());
            timeoutId = setTimeout(run, 10000);
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
