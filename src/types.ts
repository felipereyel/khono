export type Pod = {
  name: string;
  status: string;
  restarts: number;
  createdAt?: Date;
  cpu: number;
  memory: number;
  labels: Record<string, string>;
};
