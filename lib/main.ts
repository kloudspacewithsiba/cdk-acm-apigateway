import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { ApiGateway } from './constructs/gateways/api-gateway';
import { Acm } from './constructs/acm';

export class ApiGatewayStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // 1. Get an ACM certificate
    const certificate = new Acm(this, "kloudspace-ssl", {
      certificateName: "kloudspace.co.za",
      domainName: "kloudspace.co.za",
      alternativeNames: ["*.kloudspace.co.za"],
    });

    // 2. Add an API using Gateway
    const api = new ApiGateway(this, `kloudspace-api`, {
      name: 'dev.kloudspace.co.za',
      stageName: 'dev',
      customDomain: 'api.kloudspace.co.za',
      certificate: certificate.acm,
      resources: [
        // Cart
        {
          name: 'cart',
          children: [
            {
              name: '{id}',
              method: 'GET',
            },
            {
              name: 'create',
              method: 'POST',
            },
            {
              name: 'remove',
              method: 'DELETE',
            }
          ]
        },
        // Payments
        {
          name: 'payments',
          children: []
        }
      ]
    })
    
  }
}
