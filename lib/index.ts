import { Construct } from "constructs";
import { CustomizedDeployment, CustomizedDeploymentOptions } from './deployment';
import { CustomizedConfigmap, CustomizedConfigmapOptions } from './configmap';

export interface CustomizedOptions {
  deploymentOptions: CustomizedDeploymentOptions
  configmapOptions: CustomizedConfigmapOptions
}

export class CustomizedApp extends Construct {
  constructor(scope: Construct, name: string, opts: CustomizedOptions) {
    super(scope, name);

    const selector = { app: "test-app"};
    new CustomizedDeployment(this, 'deployment', selector, opts.deploymentOptions);
    new CustomizedConfigmap(this, 'configmap', opts.configmapOptions);
  }
}