import { Construct } from "constructs";
import * as k8s from '../imports/k8s';

export interface CustomizedConfigmapOptions {
  readonly namespace?: string;
  readonly data: { [key: string]: string };
}

export class CustomizedConfigmap extends Construct {
  public readonly name?: string;
  public readonly namespace?: string;

  constructor(scope: Construct, name: string, opts: CustomizedConfigmapOptions) {
    super(scope, name);
    const namespace = opts.namespace ?? 'default';
    this.namespace = namespace;
    const data = opts.data

    const configmapOpts: k8s.KubeConfigMapProps = {
      metadata: {
        name: this.namespace,
        namespace: this.namespace,
      },
      data: data,
    }
    const cfm = new k8s.KubeConfigMap(scope, 'customized-configmap', configmapOpts);
    this.name = cfm.name;
  }
}