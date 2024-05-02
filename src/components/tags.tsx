import type { Pod } from '../types';

export const StatusTag = (pod: Pod) => {
  if (pod.status === 'Running') {
    return (
      <span class="bg-green-100 text-green-800 text-xs font-medium me-1 px-1.5 py-0.5 rounded dark:bg-green-900 dark:text-green-300">
        Running ({pod.restarts})
      </span>
    );
  }

  if (pod.status === 'Terminating') {
    return (
      <span class="bg-pink-100 text-pink-800 text-xs font-medium me-1 px-1.5 py-0.5 rounded dark:bg-pink-900 dark:text-pink-300">
        Terminating ({pod.restarts})
      </span>
    );
  }

  if (pod.status === 'Pending') {
    return (
      <span class="bg-yellow-100 text-yellow-800 text-xs font-medium me-1 px-1.5 py-0.5 rounded dark:bg-yellow-900 dark:text-yellow-300">
        Pending ({pod.restarts})
      </span>
    );
  }

  return (
    <span class="bg-red-100 text-red-800 text-xs font-medium me-1 px-1.5 py-0.5 rounded dark:bg-red-900 dark:text-red-300">
      {pod.status} ({pod.restarts})
    </span>
  );
};

export const CPUTag = (pod: Pod) => (
  <span class="bg-purple-100 text-purple-800 text-xs font-medium me-1 px-1.5 py-0.5 rounded dark:bg-gray-700 dark:text-purple-400 border border-purple-400">
    CPU: {(pod.cpu / 1_000_000).toFixed(2)}m
  </span>
);

export const MemTag = (pod: Pod) => (
  <span class="bg-pink-100 text-pink-800 text-xs font-medium me-1 px-1.5 py-0.5 rounded dark:bg-gray-700 dark:text-pink-400 border border-pink-400">
    Mem: {(pod.memory / 1024).toFixed(2)}Mi
  </span>
);

export const CreatedTag = (pod: Pod) => (
  <span class="bg-gray-100 text-gray-800 text-xs font-medium me-1 px-1.5 py-0.5 rounded dark:bg-gray-700 dark:text-gray-400 border border-gray-500">
    {pod.createdAt?.toISOString().slice(0, 19)}
  </span>
);

export const LabelTag = (key: string, value: string) => (
  <span class="bg-blue-100 text-blue-800 text-xs font-medium me-1 px-1.5 py-0.5 rounded dark:bg-gray-700 dark:text-blue-400 border border-blue-400">
    {key}:{value.slice(0, 6)}
  </span>
);
