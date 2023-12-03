import { Construct } from 'constructs';
import { App, Chart, ChartProps } from 'cdk8s';
import { Pod } from 'cdk8s-plus-25';
import { DeboredApp, IngressType } from 'cdk8s-debore';
import { CustomizedApp } from './lib';

export class PodChart extends Chart {
  constructor(scope: Construct, id: string, props: ChartProps = { }) {
    super(scope, id, props);

    // define resources here
    new Pod(this, id, {
      metadata: {
        name: "nginx",
      },
      containers: [{
        image: "nginx:1.14.2",
        ports: [{number: 80}]
      }],
    })
  }
}

export class DeboredAppChart extends Chart {
  constructor(scope: Construct, id: string, props: ChartProps = { }) {
    super(scope, id, props);

    new DeboredApp(this, 'debored-app', {
      namespace: 'default',
      image: 'nginx',
      defaultReplicas: 2,
      port: 80,
      containerPort: 80,
      autoScale: true,
      ingress: IngressType.NGINX_INGRESS,
      resources: {
        limits: {cpu: '300m', memory: '300Mi'},
        requests: {cpu: '300m', memory: '300Mi'}
      }
    })
  }
}

export class CustomizeChart extends Chart {
  constructor(scope: Construct, id: string, props: ChartProps = { }) {
    super(scope, id, props);
    const appName = 'example';

    new CustomizedApp(this, 'my-customized-app', {
      deploymentOptions: {
        namespace: appName,
        labels: {
          app: appName
        },
        annotations: {
          'key-annotation-1': 'value-annotation-1',
          'key-annotation-2': 'value-annotation-2'
        },
        image: 'customized-image',
        replicas: 3,
        serviceAccountName: appName,
        resources: {
          requests: {
            cpu: '400m',
            memory: '400Mi'
          },
          limits: {
            cpu: '800m',
            memory: '800Mi'
          }
        }
      },
      configmapOptions: {
        namespace: appName,
        data: {
          'HELLO': 'WORLD',
          'HI': 'THERE',
        }
      }
    })
  }
}


const app = new App();
new PodChart(app, 'test-pod');
new DeboredAppChart(app, 'test-debored-app');
new CustomizeChart(app, 'test-customized-app');
app.synth();
