import type { Pod } from './types';
import type { Config } from './config';
import * as k8s from '@kubernetes/client-node';

export class Controller {
  kc: k8s.KubeConfig;
  client: k8s.CoreV1Api;

  constructor(private config: Config) {
    this.config = config;
    this.kc = new k8s.KubeConfig();
    this.kc.loadFromDefault();
    this.client = this.kc.makeApiClient(k8s.CoreV1Api);
  }

  async getPods(): Promise<Array<Pod>> {
    const { body } = await this.client.listNamespacedPod(
      this.config.namespace,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
    );

    return body.items
      .map((pod) => ({
        name: pod.metadata?.name ?? '',
        status: this.getStatus(pod),
        created: pod.metadata?.creationTimestamp,
        cpu: this.sumCPU(pod).toString(),
        memory: this.sumMemory(pod).toString(),
        labels: this.getLabels(pod),
        restarts: this.sumRestarts(pod),
      }))
      .toSorted((a, b) => {
        if (!a.created || !b.created) return 0;
        return b.created?.getTime() - a.created?.getTime();
      })
      .map((pod) => ({
        ...pod,
        createdAt: pod.created?.toISOString() ?? '',
      }))
      .filter((p) => Object.keys(p.labels).length > 0);
  }

  private sumMemory(pod: k8s.V1Pod): number {
    return (
      pod.spec?.containers?.reduce((acc, container) => {
        const memory = container.resources?.requests?.memory;
        if (!memory) {
          return acc;
        }
        return acc + parseInt(memory);
      }, 0) ?? 0
    );
  }

  private sumCPU(pod: k8s.V1Pod): number {
    return (
      pod.spec?.containers?.reduce((acc, container) => {
        const cpu = container.resources?.requests?.cpu;
        if (!cpu) {
          return acc;
        }
        return acc + parseInt(cpu);
      }, 0) ?? 0
    );
  }

  private sumRestarts(pod: k8s.V1Pod): number {
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
      return { ...acc, [label]: value.slice(0, 6) };
    }, {});
  }

  private getStatus(pod: k8s.V1Pod): string {
    if (pod.metadata?.deletionTimestamp) {
      return 'Terminating';
    }

    return pod.status?.phase ?? 'Unknown';
  }
}
