export const getConfig = () => {
  const port = process.env.PORT || 3333;

  const namespace = process.env.NAMESPACE || 'default';

  let labels: string[] = [];
  if (process.env.LABELS) {
    labels = process.env.LABELS.split(',');
  }

  return {
    port,
    labels,
    namespace,
  };
};

export type Config = ReturnType<typeof getConfig>;
