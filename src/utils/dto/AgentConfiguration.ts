export class AgentConfiguration {
  maxTokens: number;
  fallbackOn: string;
  mode:AgentMode;
  databaseConfig?: DBConfig;
  instructions?: string;
  suggestions?: Array<string>;
}

export type DBConfig = {
  database: number;
  connectionType: number;
  connectionString: string;
  authorizationType: number | undefined;
  tables: Array<string>;
}

export enum AgentMode {
  GENERAL = "GENERAL",
  BALANCED = "BALANCED",
  PRECISE = "PRECISE"
}
