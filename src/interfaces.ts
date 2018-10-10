export interface IHost {
  host: string;
  port: number | string;
}

export interface IOptions {
  port?: number | string;
  host?: string;
  checkFiles?: boolean;
  rootFiles?: string | null;
  database?: string;
  hosts?: IHost[];
  replicaSet?: string;
}