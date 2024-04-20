import { Construct } from 'constructs'
import * as apigateway from 'aws-cdk-lib/aws-apigateway'
import { IRestApi } from './types';

export class ApiGateway extends Construct {

    public readonly apg : apigateway.RestApi;

    constructor(scope: Construct, id: string, props: IRestApi) {
        super(scope, id);

        // 1. APi gateway
        this.apg = new apigateway.RestApi(this, `${id}-apg`, {
            restApiName: props.name,
            deployOptions: {
                stageName: props.stageName
            }
        });

        // 2. Add custom domain name
        const domain = new apigateway.DomainName(this, `${id}-apg-domain-name`, {
            domainName: props.customDomain,
            certificate: props.certificate,
            basePath: "api",
            mapping: this.apg
        });

        // 3. Add domain name and rest api mapping
        const mapping = new apigateway.BasePathMapping(this, `${id}-api-mapping`, {
            domainName: domain,
            restApi: this.apg
        });

        // 4. Methods
        this.apg.root.addMethod('GET');

        // 5. Custom paths
        if(props.resources.length > 0) {
            props.resources.forEach(res => {

                // Add the base resource path
                const baseResource = this.apg.root.addResource(res.name);
                baseResource.addMethod("GET");

                
                if(res.children.length > 0) {
                    // Add child resources
                    res.children.forEach(child => {
                        const childResource = baseResource.addResource(child.name);
                        childResource.addMethod(child.method)
                    })
                }

            })
        }

    }
}