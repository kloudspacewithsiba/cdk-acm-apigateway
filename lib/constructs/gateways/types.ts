import { ICertificate } from "aws-cdk-lib/aws-certificatemanager";

export interface IRestApi {
    name: string,
    stageName: string,
    customDomain: string,
    certificate: ICertificate,
    resources: IResource[]
}

export interface IResourceChild {
    name: string,
    method: string,
    proxy?: string
}

export interface IResource {
    name: string,
    children: IResourceChild[]
}