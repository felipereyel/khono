import type { Pod } from '../types';

import { CPUTag, CreatedTag, LabelTag, MemTag, StatusTag } from './tags';

export const GridView = (pods: Pod[]) => (
  <div id="pods" class="gap-1 p-1 grid grid-cols-[repeat(auto-fill,minmax(23rem,1fr))]">
    {pods.map((pod) => (
      <div class="block w-full p-1.5 bg-white border border-gray-200 rounded-lg shadow hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700">
        <h5 class="mb-1 font-bold tracking-tight text-gray-900 dark:text-white">
          {pod.name.slice(0, 20)}
        </h5>

        <div class="flex items-center">
          {Object.entries(pod.labels).map(([key, value]) => LabelTag(key, value))}
          <StatusTag {...pod} />
        </div>

        <div class="flex items-center mt-2">
          <CPUTag {...pod} />
          <MemTag {...pod} />
          <CreatedTag {...pod} />
        </div>
      </div>
    ))}
  </div>
);
