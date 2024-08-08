import {BaseEntity} from "./base/BaseEntity";
import {Workspace} from "./Workspace";
import {AgentConfiguration} from "./AgentConfiguration";

export class Agent extends BaseEntity{
  workspace: Workspace;
  configuration: AgentConfiguration;
  type: AgentType;


  constructor(name: string, workspace: Workspace) {
    super(undefined, name);
    this.workspace = workspace;
  }
}

export enum AgentType {
  CUSTOM = 1,
  CHAT_WITH_DATABASE = 2,
  SALES_AGENT = 3,
  SALES_ANALYZER = 3
}
