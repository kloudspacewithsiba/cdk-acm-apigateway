import { Construct } from 'constructs'
import * as acm from 'aws-cdk-lib/aws-certificatemanager';
import { CfnOutput } from 'aws-cdk-lib';
import { ICertificate } from './types';


export class Acm extends Construct {
    
    public readonly acm : acm.ICertificate;
    
    constructor(scope: Construct, id: string, props: ICertificate) {
        super(scope, id);

        this.acm = new acm.Certificate(this, `${id}-acm`, {
            certificateName: props.certificateName,
            domainName: props.domainName,
            subjectAlternativeNames: props.alternativeNames,
            validation: acm.CertificateValidation.fromDns()
        });

        const certificateArn = this.acm.certificateArn;

        new CfnOutput(this, "certificateARN", {
            value: certificateArn
        })

    }
}