import type { Pod, View } from '../types';

import { TableView } from './table';
import { GridView } from './grid';

const page = (title: string, Child: JSX.Element) => (
  <html>
    <head>
      <title>{title} | Khono</title>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <script src="https://cdn.tailwindcss.com"></script>
      <script src="https://unpkg.com/htmx.org@1.9.6" crossorigin="anonymous"></script>
      <script src="https://unpkg.com/htmx.org/dist/ext/ws.js"></script>
    </head>
    <body id="body" class="bg-slate-900 text-white">
      {Child}
    </body>
  </html>
);

export const Home = (view: View) =>
  page(
    'Home',
    <div hx-ext="ws" ws-connect={view == 'table' ? '/ws?view=table' : '/ws'} hx-target="pods">
      <div id="pods"></div>
    </div>,
  );

export const Pods = (pods: Pod[], view: View) =>
  view === 'table' ? TableView(pods) : GridView(pods);
