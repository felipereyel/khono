import type { Pod } from './types';

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

export const Home = page(
  'Home',
  <div hx-ext="ws" ws-connect="/ws" hx-target="pods">
    <div id="pods"></div>
  </div>,
);

const Running = (restarts: number) => (
  <span class="bg-green-100 text-green-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded dark:bg-gray-700 dark:text-green-400 border border-green-400">
    Running ({restarts})
  </span>
);

const Terminating = (restarts: number) => (
  <span class="bg-pink-100 text-pink-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded dark:bg-gray-700 dark:text-pink-400 border border-pink-400">
    Terminating ({restarts})
  </span>
);

const Other = (restarts: number, status: string) => (
  <span class="bg-red-100 text-red-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded dark:bg-gray-700 dark:text-red-400 border border-red-400">
    {status} ({restarts})
  </span>
);

export const Pods = (pods: Pod[]) => (
  <div id="pods" class="relative overflow-x-auto">
    <table class="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
      <thead class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
        <tr>
          <th scope="col" class="px-6 py-3">
            Name
          </th>
          <th scope="col" class="px-6 py-3">
            Created
          </th>
          <th scope="col" class="px-6 py-3">
            Status
          </th>
          <th scope="col" class="px-6 py-3">
            Resources
          </th>
          <th scope="col" class="px-6 py-3">
            Labels
          </th>
        </tr>
      </thead>
      <tbody>
        {pods.map((pod) => (
          <tr class="bg-white border-t dark:bg-gray-800 dark:border-gray-700">
            <th
              scope="row"
              class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
            >
              {pod.name.slice(0, 20)}
            </th>
            <td class="px-6 py-4">{pod.createdAt?.toISOString().slice(0, 19)}</td>
            <td class="px-6 py-4">
              {pod.status === 'Running'
                ? Running(pod.restarts)
                : pod.status === 'Terminating'
                ? Terminating(pod.restarts)
                : Other(pod.restarts, pod.status)}
            </td>
            <td class="px-6 py-4">
              <span class="bg-indigo-100 text-indigo-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded dark:bg-gray-700 dark:text-indigo-400 border border-indigo-400">
                CPU: {(pod.cpu / 1000).toFixed(2)}m
              </span>
              <span class="bg-purple-100 text-purple-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded dark:bg-gray-700 dark:text-purple-400 border border-purple-400">
                Mem: {(pod.memory / 1024).toFixed(2)}Mi
              </span>
            </td>
            <td class="px-6 py-4">
              <div class="flex items-center space-x-2">
                {Object.entries(pod.labels).map(([key, value]) => (
                  <span class="bg-blue-100 text-blue-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded dark:bg-gray-700 dark:text-blue-400 border border-blue-400">
                    {key}:{value.slice(0, 6)}
                  </span>
                ))}
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);
