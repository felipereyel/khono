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
              {pod.name}
            </th>
            <td class="px-6 py-4">{pod.createdAt}</td>
            <td class="px-6 py-4">
              {pod.status}({pod.restarts})
            </td>
            <td class="px-6 py-4">
              <span class="bg-purple-100 text-purple-800 text-sm font-medium me-2 px-2.5 py-0.5 rounded dark:bg-purple-900 dark:text-purple-300">
                CPU:{pod.cpu}
              </span>
              <span class="bg-pink-100 text-pink-800 text-sm font-medium me-2 px-2.5 py-0.5 rounded dark:bg-pink-900 dark:text-pink-300">
                Mem:{pod.memory}
              </span>
            </td>
            <td class="px-6 py-4">
              <div class="flex items-center space-x-2">
                {Object.entries(pod.labels).map(([key, value]) => (
                  <span class="bg-blue-100 text-blue-800 text-sm font-medium me-2 px-2.5 py-0.5 rounded dark:bg-blue-900 dark:text-blue-300">
                    {key}:{value}
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

export const APods = (pods: Pod[]) => (
  <div id="pods">
    {pods.map((pod) => (
      <div class="p-4 border-b border-gray-200 dark:border-gray-600">
        <div class="flex items-center justify-between">
          <div class="flex items-center space-x-4">
            <span class="text-xl font-semibold">{pod.status}</span>
            <span class="text-sm text-gray-400 dark:text-gray-500">{pod.createdAt}</span>

            <div class="flex items-center space-x-2">
              <span class="text-sm text-gray-400 dark:text-gray-500">CPU:</span>
              <span class="text-sm text-gray-400 dark:text-gray-500">{pod.cpu}</span>

              <span class="text-sm text-gray-400 dark:text-gray-500">Memory:</span>
              <span class="text-sm text-gray-400 dark:text-gray-500">{pod.memory}</span>

              <span class="text-sm text-gray-400 dark:text-gray-500">Restarts:</span>
              <span class="text-sm text-gray-400 dark:text-gray-500">{pod.restarts}</span>

              <div class="flex items-center space-x-2">
                {Object.entries(pod.labels).map(([key, value]) => (
                  <span class="bg-blue-100 text-blue-800 text-sm font-medium me-2 px-2.5 py-0.5 rounded dark:bg-blue-900 dark:text-blue-300">
                    {key}:{value}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    ))}
  </div>
);
