export type Pod = {
  name: string;
  status: string;
  restarts: number;
  createdAt: string;
  cpu: string;
  memory: string;
  labels: Record<string, string>;
};
