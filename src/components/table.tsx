import type { Pod } from '../types';

import { CPUTag, CreatedTag, LabelTag, MemTag, StatusTag } from './tags';

export const TableView = (pods: Pod[]) => (
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
              class="px-6 py-1 font-medium text-gray-900 whitespace-nowrap dark:text-white"
            >
              {pod.name.slice(0, 20)}
            </th>
            <td class="px-6 py-1">
              <CreatedTag {...pod} />
            </td>
            <td class="px-6 py-1">
              <StatusTag {...pod} />
            </td>
            <td class="px-6 py-1">
              <CPUTag {...pod} />
              <MemTag {...pod} />
            </td>
            <td class="px-6 py-1">
              <div class="flex items-center space-x-2">
                {Object.entries(pod.labels).map(([key, value]) => LabelTag(key, value))}
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);
