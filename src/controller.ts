import type { Pod } from './types';
import type { Config } from './config';
import * as k8s from '@kubernetes/client-node';

export class Controller {
  kc: k8s.KubeConfig;
  coreClient: k8s.CoreV1Api;
  customObjectsClient: k8s.CustomObjectsApi;

  constructor(private config: Config) {
    this.config = config;
    this.kc = new k8s.KubeConfig();
    this.kc.loadFromDefault();

    this.coreClient = this.kc.makeApiClient(k8s.CoreV1Api);
    this.customObjectsClient = this.kc.makeApiClient(k8s.CustomObjectsApi);
  }

  private async getPodMetrics(): Promise<k8s.PodMetric[]> {
    const result = await this.customObjectsClient.listNamespacedCustomObject(
      'metrics.k8s.io',
      'v1beta1',
      this.config.namespace,
      'pods',
    );

    return (result.body as k8s.PodMetricsList).items;
  }

  async getPods(): Promise<Array<Pod>> {
    const metrics = await this.getPodMetrics();

    const { body } = await this.coreClient.listNamespacedPod(this.config.namespace);

    return body.items
      .map((pod) => {
        const { memory, cpu } = this.getMetrics(pod, metrics);
        return {
          cpu,
          memory,
          name: pod.metadata?.name ?? '',
          status: this.getStatus(pod),
          createdAt: pod.metadata?.creationTimestamp,
          labels: this.getLabels(pod),
          restarts: this.getRestarts(pod),
        };
      })
      .toSorted((a, b) => {
        if (!a.createdAt || !b.createdAt) return 0;
        return b.createdAt?.getTime() - a.createdAt?.getTime();
      })
      .filter((p) => Object.keys(p.labels).length > 0);
  }

  private getMetrics(pod: k8s.V1Pod, metrics: k8s.PodMetric[]): { memory: number; cpu: number } {
    const metric = metrics.find((m) => m.metadata.name === pod.metadata?.name);
    if (!metric) return { memory: 0, cpu: 0 };

    return metric.containers.reduce(
      (acc, container) => {
        return {
          memory: acc.memory + parseInt(container.usage.memory.replace('Ki', '')),
          cpu: acc.cpu + parseInt(container.usage.cpu.replace('n', '')),
        };
      },
      { memory: 0, cpu: 0 },
    );
  }

  private getRestarts(pod: k8s.V1Pod): number {
    return (
      pod.status?.containerStatuses?.reduce((acc, container) => {
        return acc + container.restartCount;
      }, 0) ?? 0
    );
  }

  private getLabels(pod: k8s.V1Pod): Record<string, string> {
    return this.config.labels.reduce((acc, label) => {
      const value = pod.metadata?.labels?.[label];
      if (!value) return acc;
      return { ...acc, [label]: value };
    }, {});
  }

  private getStatus(pod: k8s.V1Pod) {
    if (pod.metadata?.deletionTimestamp) {
      return 'Terminating';
    }

    return pod.status?.phase ?? 'Unknown';
  }
}
