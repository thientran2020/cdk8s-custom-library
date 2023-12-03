import * as k8s from '../imports/k8s';

export interface ResourceQuantity {
  readonly cpu?: string;
  readonly memory?: string;
}

export function ConvertQuantity(user: ResourceQuantity | undefined, defaults: { cpu: string, memory: string }): { [key: string]: k8s.Quantity } {
  // defaults
  if (!user) {
    return {
      cpu: k8s.Quantity.fromString(defaults.cpu),
      memory: k8s.Quantity.fromString(defaults.memory),
    }
  }

  const result: { [key: string]: k8s.Quantity } = { };
  if (user.cpu) {
    result.cpu = k8s.Quantity.fromString(user.cpu);
  }
  if (user.memory) {
    result.memory = k8s.Quantity.fromString(user.memory);
  }
  return result;
};