import { Construct } from "constructs";
import * as k8s from '../imports/k8s';
import { ConvertQuantity } from './helper';

export interface CustomizedDeploymentOptions {
  readonly namespace?: string;
  readonly labels: { [key: string]: string; };
  readonly annotations: { [key: string]: string; };
  readonly image: string;
  readonly replicas?: number;
  readonly serviceAccountName?: string;
  readonly resources?: ResourceRequirements;
}

export interface ResourceQuantity {
  readonly cpu?: string;
  readonly memory?: string;
}

export interface ResourceRequirements {
  readonly limits?: ResourceQuantity;
  readonly requests?: ResourceQuantity;
}

export class CustomizedDeployment extends Construct {
  public readonly name: string;
  public readonly namespace: string;

  constructor(scope: Construct, name: string, selector: {[key: string]: string}, opts: CustomizedDeploymentOptions) {
    super(scope, name);
    const namespace = opts.namespace ?? 'default';
    this.namespace = namespace;
    this.name = namespace;
    
    const serviceAccountName = opts.serviceAccountName;
    const replicas = opts.replicas ?? 1;
    const image = opts.image;
    const annotations = opts.annotations;
    const labels = opts.labels;
    const resources = {
      limits: ConvertQuantity(opts.resources?.limits, {cpu: '500m', memory: '250Mi'}),
      requests: ConvertQuantity(opts.resources?.requests, {cpu: '500m', memory: '250Mi'})
    }
    
    const deploymentOpts: k8s.KubeDeploymentProps = {
      metadata: {
        name: this.namespace,
        namespace: this.namespace,
        annotations: annotations,
        labels: labels,
      },
      spec: {
        replicas: replicas,
        selector: { matchLabels: selector },
        template: {
          metadata: {labels: selector},
          spec: {
            serviceAccountName: serviceAccountName,
            containers: [{
              name: 'test-app',
              image: image,
              envFrom: [{configMapRef: {name: "customized-configmap", optional: true}}],
              resources: resources,
            }],
          }
        }
      }
    }
    new k8s.KubeDeployment(this, 'customized-deployment', deploymentOpts);
  }
}
